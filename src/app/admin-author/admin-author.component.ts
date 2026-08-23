import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../services/author.service';
import { toSlug } from '../utils/slug.util';

/**
 * Admin form for author details. Saving creates the author's public page at
 * /author/<slug> and adds the name to the post and equipment editors'
 * dropdowns — the same way adding a post creates its blog page.
 */
@Component({
  selector: 'app-admin-author',
  templateUrl: './admin-author.component.html',
  styleUrls: ['./admin-author.component.css'],
  standalone: false
})
export class AdminAuthorComponent implements OnInit {

  author: any = {
    authorID: null,
    name: '',
    slug: '',
    role: '',
    experience: '',
    bio: '',
    photoUrl: '',
    email: '',
    youtubeUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    xUrl: '',
    isActive: true
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Set once the admin edits the slug by hand, so we stop deriving it.
  private slugEditedByHand = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthorService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.slugEditedByHand = true;   // keep the slug an existing page already uses
      this.service.getById(id).subscribe({
        next: res => this.author = { ...this.author, ...res },
        error: () => this.errorMessage = 'That author could not be loaded.'
      });
    }
  }

  /** The page URL follows the name until someone types their own slug. */
  onNameChange(): void {
    if (!this.slugEditedByHand) {
      this.author.slug = toSlug(this.author.name || '');
    }
  }

  onSlugChange(): void {
    this.slugEditedByHand = true;
    this.author.slug = toSlug(this.author.slug || '');
  }

  get pageUrl(): string {
    return this.author.slug ? `/author/${this.author.slug}` : '/author/...';
  }

  isFormValid(): boolean {
    return !!(this.author.name || '').trim() && !!(this.author.slug || '').trim();
  }

  save(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Author name is required.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.author,
      authorID: this.author.authorID ?? 0,
      name: (this.author.name || '').trim(),
      slug: toSlug(this.author.slug || this.author.name || '')
    };

    const request$ = this.author.authorID
      ? this.service.update(payload)
      : this.service.add(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        // Both editors cache the name list; drop it so the new author shows up.
        this.service.clearNamesCache();

        if (this.author.authorID) {
          this.successMessage = 'Author updated successfully.';
        } else {
          this.successMessage = `Author added. Their page is live at /author/${payload.slug}.`;
          this.resetForm();
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.error
          || 'Something went wrong while saving. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.author = {
      authorID: null,
      name: '',
      slug: '',
      role: '',
      experience: '',
      bio: '',
      photoUrl: '',
      email: '',
      youtubeUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      xUrl: '',
      isActive: true
    };
    this.slugEditedByHand = false;
    this.errorMessage = '';
  }

  goToList(): void {
    this.router.navigate(['/admin/author-list']);
  }
}
