import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServerImageUploadPlugin } from '../utils/image-upload.adapter';
import { EquipmentService } from '../services/equipment.service';
import { istInputToUtcIso, utcToIstInputValue } from '../utils/date.util';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css'],
  standalone: false
})
export class EquipmentFormComponent implements OnInit {

  public Editor: any = null;
  // Config is completed at runtime once the modular CKEditor build is
  // dynamically imported (plugins are class references from the 'ckeditor5'
  // package and must only be loaded in the browser to keep SSR safe).
  public editorConfig: any = {
    licenseKey: 'GPL',
    toolbar: {
      items: [
        'heading',
        'fontSize',
        'fontFamily',
        '|',
        'bold',
        'italic',
        'underline',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        'outdent',
        'indent',
        '|',
        'insertTable',
        'uploadImage',
        'blockQuote',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },

    // The equipment title is the detail page's only h1, so the content offers
    // H2 to H5 and no h1 at all.
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' }
      ]
    },

    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Roboto, sans-serif',
        'Poppins, sans-serif',
        'Georgia, serif',
        'Times New Roman, Times, serif'
      ]
    },

    // Text size for the selected range. 'default' clears it again.
    fontSize: {
      options: [12, 14, 'default', 18, 20, 24, 32],
      supportAllValues: false
    },

    // Bullet and number styles (disc, circle, decimal, lower-roman, ...) plus
    // "start numbering at" for the selected list.
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },

    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ]
    },

    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
        'toggleTableCaption'
      ]
    },

    // Images are uploaded to the API and referenced by URL. Embedding base64
    // would bloat every row of equipment content and slow the detail page.
    extraPlugins: [ServerImageUploadPlugin]
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Names come from the Author records managed in the admin portal.
  authors: string[] = [];

  equipment: any = {
    equipmentID: null,
    title: '',
    keywords: '',
    shortDescription: '',
    description: '',
    authorName: null,
    // Empty means publish immediately - see saveButtonLabel().
    publishedDate: '',
    mainCategoryIDs: [],
    subCategoryIDs: []
  };

  // MAIN + SUB CATEGORY STRUCTURE (loaded from the API)
  categories: any[] = [];

  // MAIN CATEGORY TOGGLE
  toggleMainCategory(catId: number, event: any) {
    if (!event.target.checked) {
      // Prevent unchecking if any sub category exists
      const hasSub = this.categories
        .find(c => c.id === catId)!
        .subs.some((s: any) => this.equipment.subCategoryIDs.includes(s.id));

      if (hasSub) {
        event.target.checked = true;
        return;
      }

      this.equipment.mainCategoryIDs =
        this.equipment.mainCategoryIDs.filter((id: number) => id !== catId);
    } else {
      this.equipment.mainCategoryIDs.push(catId);
    }
  }

  // SUB CATEGORY TOGGLE
  toggleSubCategory(mainId: number, subId: number, event: any) {
    if (event.target.checked) {
      this.equipment.subCategoryIDs.push(subId);

      // AUTO select main category
      if (!this.equipment.mainCategoryIDs.includes(mainId)) {
        this.equipment.mainCategoryIDs.push(mainId);
      }
    } else {
      this.equipment.subCategoryIDs =
        this.equipment.subCategoryIDs.filter((id: number) => id !== subId);
    }
  }

  isFormValid(): boolean {
    return (
      (this.equipment.title || '').trim() !== '' &&
      (this.equipment.shortDescription || '').trim() !== '' &&
      (this.equipment.description || '').trim() !== '' &&
      !!this.equipment.authorName &&
      this.equipment.subCategoryIDs.length > 0
    );
  }

  /* ================= Dates =================
     A publish time typed here always means IST, whatever zone this machine is
     in. istInputToUtcIso/utcToIstInputValue translate between the IST
     wall-clock the picker shows and the UTC instant the API stores. */

  /** Was a future publish time picked? Then saving schedules the item. */
  isScheduled(): boolean {
    if (!this.equipment.publishedDate) return false;

    const utc = istInputToUtcIso(this.equipment.publishedDate);
    return !!utc && new Date(utc).getTime() > Date.now();
  }

  saveButtonLabel(): string {
    if (this.equipment.equipmentID) return 'Update Equipment';
    return this.isScheduled() ? 'Schedule Equipment' : 'Publish Now';
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: EquipmentService,
    private authorService: AuthorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.getCategories().subscribe(res => {
      this.categories = this.service.buildCategoryTree(res);
    });

    this.authorService.names()
      .subscribe(rows => this.authors = rows.map(a => a.name));

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEquipment(id);
    }

    if (isPlatformBrowser(this.platformId)) {
      // Load the modular CKEditor build only in the browser (it touches
      // `window`/`document` and would break server-side rendering).
      import('ckeditor5').then((CK: any) => {
        const {
          ClassicEditor, Essentials, Paragraph, Heading,
          Bold, Italic, Underline, Link, List, ListProperties, BlockQuote,
          Image, ImageUpload, ImageToolbar, ImageStyle, ImageCaption, ImageResize,
          Table, TableToolbar, TableProperties, TableCellProperties,
          TableCaption, TableColumnResize,
          FontFamily, FontSize, Indent, IndentBlock,
          Autoformat, PasteFromOffice
        } = CK;

        this.editorConfig.plugins = [
          Essentials, Paragraph, Heading, Bold, Italic, Underline, Link,
          List, ListProperties, BlockQuote,
          Image, ImageUpload, ImageToolbar, ImageStyle, ImageCaption, ImageResize,
          Table, TableToolbar, TableProperties, TableCellProperties,
          TableCaption, TableColumnResize,
          FontFamily, FontSize, Indent, IndentBlock,
          Autoformat, PasteFromOffice
        ];

        // Set the editor class last so the template only renders the
        // <ckeditor> once the config (incl. plugins) is ready.
        this.Editor = ClassicEditor;
      }).catch((err) => {
        console.error('Failed to load the equipment editor', err);
        this.errorMessage = 'The editor failed to load. Please refresh the page.';
      });
    }
  }

  loadEquipment(id: number) {
    this.service.getById(id).subscribe(res => {
      if (!res) { return; }
      const cats = res.categories || [];
      this.equipment = {
        equipmentID: res.equipmentID,
        title: res.title || '',
        keywords: res.keywords || '',
        shortDescription: res.shortDescription || '',
        description: res.description || '',
        authorName: res.authorName || null,
        // Stored as UTC; the picker shows and reads it back as IST.
        publishedDate: utcToIstInputValue(res.publishedDate) || '',
        mainCategoryIDs: cats.filter((c: any) => !c.parentCategoryID).map((c: any) => c.categoryID),
        subCategoryIDs: cats.filter((c: any) => c.parentCategoryID).map((c: any) => c.categoryID)
      };
    });
  }

  resetForm() {
    this.equipment = {
      equipmentID: null,
      title: '',
      keywords: '',
      shortDescription: '',
      description: '',
      authorName: null,
      publishedDate: '',
      mainCategoryIDs: [],
      subCategoryIDs: []
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  save() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const wasScheduled = this.isScheduled();

    const payload = {
      // New equipment has no ID yet; send 0 (C# int default) instead of null
      // so the non-nullable `int EquipmentID` on the API DTO deserializes.
      equipmentID: this.equipment.equipmentID ?? 0,
      title: this.equipment.title,
      shortDescription: this.equipment.shortDescription,
      description: this.equipment.description,
      keywords: this.equipment.keywords,
      authorName: this.equipment.authorName,
      // The picked time is IST; the API stores the matching UTC instant.
      publishedDate: istInputToUtcIso(this.equipment.publishedDate),
      // The mapping table stores both main and sub category ids together.
      categoryIDs: [...this.equipment.mainCategoryIDs, ...this.equipment.subCategoryIDs].join(',')
    };

    const request$ = this.equipment.equipmentID
      ? this.service.update(payload)
      : this.service.add(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        // Work out the message before resetting (resetForm clears these fields).
        const message = this.equipment.equipmentID
          ? 'Equipment updated successfully'
          : wasScheduled
            ? 'Equipment scheduled - it goes live at the IST time you picked.'
            : 'Equipment published successfully';
        // Stay on the form for the next entry instead of leaving for the list.
        this.resetForm();
        this.successMessage = message;
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Something went wrong while saving. Please try again.';
      }
    });
  }
}
