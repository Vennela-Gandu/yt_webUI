import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { PostService } from '../post.service';
import { ServerImageUploadPlugin } from '../utils/image-upload.adapter';
import { istInputToUtcIso, utcToIstInputValue } from '../utils/date.util';
import { AuthorService } from '../services/author.service';
import { ensureEditorStyles } from '../utils/editor-styles';
import { ImageUploadService } from '../services/image-upload.service';


@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.css'],
  standalone: false
})
export class AdminPostComponent implements OnInit {

  /* ================= CKEditor ================= */
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

    // The post title is the only h1 on the page, so content headings start at H2.
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
      ]
    },

    // Text size for the selected range. 'default' clears it again.
    fontSize: {
      options: [12, 14, 'default', 18, 20, 24, 30],
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

    extraPlugins: [ServerImageUploadPlugin]
  };

  /* ================= Post Model ================= */
  post: any = {
    title: '',
    description: '',
    shortDescription: '',
    keywords: '',
    authorName: null,
    categoryIDs: [] as number[],
    // Optional: null means the article renders with no image under its title.
    featuredImage: null as string | null,
    // Empty means publish immediately - see saveButtonLabel().
    publishedDate: null
  };

  categories: any[] = [];
  // Names come from the Author records managed in the admin portal.
  authors: string[] = [];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  postID: number | null = null;
  isEdit = false;

  /* ================= Constructor ================= */
  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    private authorService: AuthorService,
    private images: ImageUploadService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loadCategories();
    this.loadAuthors();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.postID = +id;
      this.loadPost();
    }
  }

  ngOnInit(): void {
    // Load the CKEditor build only on browser to avoid SSR errors (window is not defined)
    if (isPlatformBrowser(this.platformId)) {
      // The editor stylesheets are ~230 KB and only needed here, so they are
      // fetched now rather than shipped in the global stylesheet.
      ensureEditorStyles(this.document);

      // Load the modular CKEditor build only in the browser (it touches
      // `window`/`document` and would break server-side rendering).
      import('ckeditor5').then((CK: any) => {
        const {
          ClassicEditor, Essentials, Paragraph, Heading,
          Bold, Italic, Underline, Link, List, ListProperties, BlockQuote,
          Image, ImageUpload, ImageToolbar, ImageStyle, ImageCaption, ImageResize,
          Table, TableToolbar, TableProperties, TableCellProperties,
          TableCaption, TableColumnResize,
          FontSize, Indent, IndentBlock,
          Autoformat, PasteFromOffice
        } = CK;

        this.editorConfig.plugins = [
          Essentials, Paragraph, Heading, Bold, Italic, Underline, Link,
          List, ListProperties, BlockQuote,
          Image, ImageUpload, ImageToolbar, ImageStyle, ImageCaption, ImageResize,
          Table, TableToolbar, TableProperties, TableCellProperties,
          TableCaption, TableColumnResize,
          FontSize, Indent, IndentBlock,
          Autoformat, PasteFromOffice
        ];

        // Set the editor class last so the template only renders the
        // <ckeditor> once the config (incl. plugins) is ready.
        this.Editor = ClassicEditor;
      }).catch((err) => {
        console.error('Failed to load the blog editor', err);
        this.errorMessage = 'The editor failed to load. Please refresh the page.';
      });
    }
  }

  /* ================= Category Handling ================= */
  onCategoryToggle(categoryID: number, event: any): void {
    if (event.target.checked) {
      this.post.categoryIDs.push(categoryID);
    } else {
      this.post.categoryIDs = this.post.categoryIDs.filter(
        (id: number) => id !== categoryID
      );
    }
  }

  /* ================= Load Existing Post ================= */
  loadPost(): void {
    this.service.getPostById(this.postID!)
      .subscribe(res => {
        if (res?.categoryIDs) {
          res.categoryIDs = res.categoryIDs
            .split(',')
            .map((v: string) => Number(v.trim()))
            .filter((n: number) => !isNaN(n));
        }
        // Stored as UTC; the picker shows and reads it back as IST.
        res.publishedDate = utcToIstInputValue(res.publishedDate);
        this.post = res;
      });
  }

  /* ================= Load Categories ================= */
  loadCategories(): void {
    this.service.getCategories('blog')
      .subscribe(res => this.categories = res);
  }

  /* ================= Load Authors ================= */
  loadAuthors(): void {
    this.authorService.names()
      .subscribe(rows => this.authors = rows.map(a => a.name));
  }

  /* ================= Dates =================
     A publish time typed here always means IST, whatever zone this machine is
     in. istInputToUtcIso/utcToIstInputValue translate between the IST
     wall-clock the picker shows and the UTC instant the API stores. */

  /** Was a future publish time picked? Then saving schedules the post. */
  isScheduled(): boolean {
    if (!this.post.publishedDate) return false;

    const utc = istInputToUtcIso(this.post.publishedDate);
    return !!utc && new Date(utc).getTime() > Date.now();
  }

  saveButtonLabel(): string {
    if (this.post.postID) return 'Update Post';
    return this.isScheduled() ? 'Schedule Post' : 'Publish Now';
  }

  /* ================= Validation ================= */
  isFormValid(): boolean {
    return (
      !!this.post.title?.trim() &&
      !!this.post.description?.trim() &&
      !!this.post.shortDescription?.trim() &&
      !!this.post.authorName &&
      this.post.categoryIDs.length > 0
    );
  }

  /* ================= Save / Update ================= */
  save(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isSubmitting = true;

    // Send a copy so a failed save leaves the form exactly as the author left
    // it. The picked time is IST, converted here to the UTC instant the API
    // stores; categoryIDs go over the wire as "1, 2".
    const wasScheduled = this.isScheduled();
    const payload = {
      ...this.post,
      publishedDate: istInputToUtcIso(this.post.publishedDate),
      categoryIDs: (this.post.categoryIDs || []).join(', ')
    };

    const request = payload.postID
      ? this.service.updatePost(payload)
      : this.service.addPost(payload);

    request.subscribe({
      next: () => {
        this.successMessage = payload.postID
          ? 'Post updated successfully!'
          : wasScheduled
            ? 'Post scheduled - it goes live at the time you picked.'
            : 'Post published successfully!';

        this.isSubmitting = false;

        if (!payload.postID) {
          this.resetForm();
        }
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /* ================= Featured image ================= */

  imageUploading = false;
  imageError = '';

  /** Validates the chosen file, then uploads it and keeps the URL on the post. */
  onFeaturedImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError = '';

    if (!file) return;

    this.images.validate(file).then(problem => {
      if (problem) {
        this.imageError = problem;
        input.value = '';
        return;
      }

      this.imageUploading = true;

      this.images.upload(file).subscribe({
        next: res => {
          this.imageUploading = false;
          if (res?.url) {
            this.post.featuredImage = res.url;
          } else {
            this.imageError = 'Upload succeeded but no image URL came back.';
            input.value = '';
          }
        },
        error: () => {
          this.imageUploading = false;
          this.imageError = 'Upload failed. Please try again.';
          input.value = '';
        }
      });
    });
  }

  removeFeaturedImage(input: HTMLInputElement): void {
    this.post.featuredImage = null;
    this.imageError = '';
    input.value = '';
  }

  /* ================= Reset ================= */
  resetForm(): void {
    this.post = {
      postID: null,
      title: '',
      featuredImage: null,
      description: '',
      shortDescription: '',
      keywords: '',
      authorName: null,
      categoryIDs: [] as number[],
      publishedDate: null
    };

    this.errorMessage = '';
    this.isSubmitting = false;
  }
}
