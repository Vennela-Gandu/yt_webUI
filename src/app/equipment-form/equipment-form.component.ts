import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Base64UploadPlugin } from '../utils/base64-upload.adapter';
import { EquipmentService } from '../services/equipment.service';

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
        '|',
        'fontFamily',
        'fontSize',
        '|',
        'bold',
        'italic',
        'underline',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'uploadImage',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
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

    fontSize: {
      options: [12, 14, 16, 18, 20, 24, 32],
      supportAllValues: false
    },

    extraPlugins: [Base64UploadPlugin]
  };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  equipment: any = {
    equipmentID: null,
    title: '',
    keywords: '', 
    shortDescription: '',
    description: '',
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
      this.equipment.subCategoryIDs.length > 0
    );
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: EquipmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.getCategories().subscribe(res => {
      this.categories = this.service.buildCategoryTree(res);
    });

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
          Bold, Italic, Underline, Link, List, BlockQuote,
          Image, ImageUpload, FontFamily, FontSize,
          Autoformat, PasteFromOffice
        } = CK;

        this.editorConfig.plugins = [
          Essentials, Paragraph, Heading, Bold, Italic, Underline,
          Link, List, BlockQuote, Image, ImageUpload, FontFamily, FontSize,
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
        // datetime-local needs 'yyyy-MM-ddTHH:mm'
        publishedDate: res.publishedDate ? res.publishedDate.substring(0, 16) : '',
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

    const payload = {
      // New equipment has no ID yet; send 0 (C# int default) instead of null
      // so the non-nullable `int EquipmentID` on the API DTO deserializes.
      equipmentID: this.equipment.equipmentID ?? 0,
      title: this.equipment.title,
      shortDescription: this.equipment.shortDescription,
      description: this.equipment.description,
      keywords: this.equipment.keywords,
      publishedDate: this.equipment.publishedDate || null,
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
          : this.equipment.publishedDate
            ? 'Equipment scheduled successfully'
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
