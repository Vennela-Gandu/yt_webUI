import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorService, Author } from '../services/author.service';

/**
 * Admin table of every author, with links to edit them, open their public
 * page, or add another one.
 */
@Component({
  selector: 'app-admin-author-list',
  templateUrl: './admin-author-list.component.html',
  styleUrls: ['./admin-author-list.component.css'],
  standalone: false
})
export class AdminAuthorListComponent implements OnInit {

  authors: Author[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private service: AuthorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.service.list(false).subscribe({
      next: rows => {
        this.authors = rows || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'The author list could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  add(): void {
    this.router.navigate(['/admin/author-form']);
  }

  edit(author: Author): void {
    this.router.navigate(['/admin/author-form', author.authorID]);
  }

  /**
   * Only offered when nothing is credited to them — the API refuses otherwise,
   * because deleting would leave bylines pointing at a page that is gone.
   */
  canDelete(author: Author): boolean {
    return (author.postCount || 0) === 0 && (author.equipmentCount || 0) === 0;
  }

  remove(author: Author): void {
    this.errorMessage = '';

    this.service.delete(author.authorID).subscribe({
      next: () => this.load(),
      error: err => this.errorMessage = err?.error?.error
        || 'That author could not be deleted.'
    });
  }
}
