import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { PostService } from '../post.service';
import { ServerImageUploadPlugin } from '../utils/image-upload.adapter';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.css'],
  standalone: false
})
export class AdminPostComponent implements OnInit {

  /* ================= CKEditor ================= */
  public Editor: any = null;

  // Only plugins shipped in @ckeditor/ckeditor5-build-classic are listed here.
  // The classic build does NOT include fontFamily/fontSize, so referencing them
  // would prevent the editor from rendering.
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
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
        'imageUpload',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },

    extraPlugins: [ServerImageUploadPlugin]
  };

  /* ================= Post Model ================= */
  post: any = {
    title: '',
    description: '',
    shortDescription: '',
    keywords: '',
    categoryIDs: [] as number[],
    publishedDate: new Date()
  };

  categories: any[] = [];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  postID: number | null = null;
  isEdit = false;

  /* ================= Constructor ================= */
  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCategories();

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
      import('@ckeditor/ckeditor5-build-classic').then((m) => {
        this.Editor = m?.default || m;
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
        this.post = res;
      });
  }

  /* ================= Load Categories ================= */
  loadCategories(): void {
    this.service.getCategories('blog')
      .subscribe(res => this.categories = res);
  }

  /* ================= Validation ================= */
  isFormValid(): boolean {
    return (
      !!this.post.title?.trim() &&
      !!this.post.description?.trim() &&
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

    if (this.post.publishedDate) {
      this.post.publishedDate = new Date(this.post.publishedDate).toISOString();
    }

    if (this.post.categoryIDs?.length > 0) {
      this.post.categoryIDs = this.post.categoryIDs.join(', ');
    }

    const request = this.post.postID
      ? this.service.updatePost(this.post)
      : this.service.addPost(this.post);

    request.subscribe({
      next: () => {
        this.successMessage = this.post.postID
          ? 'Post updated successfully!'
          : 'Post published successfully!';

        this.isSubmitting = false;

        if (!this.post.postID) {
          this.resetForm();
        }
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /* ================= Reset ================= */
  resetForm(): void {
    this.post = {
      postID: null,
      title: '',
      description: '',
      shortDescription: '',
      keywords: '',
      categoryIDs: [] as number[],
      publishedDate: null
    };

    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = false;
  }
}
