import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { toSlug } from '../utils/slug.util';

/**
 * The admin FAQ list: search, filter, and the row actions.
 *
 * Built on the same shape as the blog list so the two admin screens behave
 * identically — the same filter bar, the same pagination, the same actions.
 */
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css'],
  standalone: false
})
export class FaqListComponent implements OnInit {

  faqs: any[] = [];
  filteredFaqs: any[] = [];

  // Filters
  searchQuestion = '';
  selectedCategory = '';
  selectedStatus = '';

  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  categories: string[] = [];
  statuses: string[] = ['Published', 'Draft'];

  isLoading = true;
  errorMessage = '';

  constructor(
    private service: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs() {
    this.isLoading = true;
    this.errorMessage = '';

    // pageSize 0 means "all"; the list is filtered and paged in the browser so
    // searching does not cost a round trip. categoryId -1 means "any".
    this.service.getAllFAQs(1, 0, '', -1).subscribe({
      next: res => {
        this.faqs = (res?.faqs || []).map((f: any) => {
          const names = this.categoryNamesOf(f);
          return {
            ...f,
            // Normalised once here so the table, the filter and the View link
            // all read the same values.
            categoryNames: names,
            categoryLabel: names.join(', '),
            // The public FAQ page groups by category slug.
            categorySlug: names.length ? toSlug(names[0]) : ''
          };
        });

        this.categories = [...new Set(
          this.faqs.flatMap(f => f.categoryNames as string[])
        )].sort();

        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'The FAQ list could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    const search = this.searchQuestion.toLowerCase();

    this.filteredFaqs = this.faqs.filter(faq => {
      const matchesQuestion =
        !search || (faq.question || '').toLowerCase().includes(search);

      const matchesCategory =
        !this.selectedCategory ||
        (faq.categoryNames || []).includes(this.selectedCategory);

      const matchesStatus =
        !this.selectedStatus || this.statusOf(faq) === this.selectedStatus;

      return matchesQuestion && matchesCategory && matchesStatus;
    });

    this.totalPages = Math.ceil(this.filteredFaqs.length / this.pageSize);
    this.currentPage = 1;
  }

  /**
   * The category names on a FAQ, however the API expressed them.
   *
   * getAllFAQs returns them as [{ name }] — and as null on records with no
   * category. It is not the comma-separated string the blog list receives, so
   * this normalises both shapes to a plain array of names.
   */
  private categoryNamesOf(faq: any): string[] {
    const raw = faq?.categoryNames;
    if (!raw) return [];

    const values = Array.isArray(raw) ? raw : String(raw).split(',');

    return values
      .map((c: any) => (typeof c === 'string' ? c : c?.name || ''))
      .map((c: string) => c.trim())
      .filter((c: string) => !!c);
  }

  /**
   * The record's status, or null when the API does not report one.
   *
   * getAllFAQs currently returns no status field, so the column shows a dash
   * rather than claiming every FAQ is published. It fills in on its own once
   * the API includes it.
   */
  statusOf(faq: any): string | null {
    if (faq.status === undefined || faq.status === null) return null;
    // The editor stores a boolean; a string comes through unchanged.
    if (typeof faq.status === 'boolean') return faq.status ? 'Published' : 'Draft';
    return String(faq.status);
  }

  get paginatedFaqs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFaqs.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearFilters() {
    this.searchQuestion = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  addFaq() {
    this.router.navigate(['/admin/faq']);
  }

  editFaq(faq: any) {
    this.router.navigate(['/admin/faq', faq.faqid]);
  }

  /** The public page this FAQ appears on, opened in a new tab. */
  viewUrl(faq: any): string[] {
    return faq.categorySlug
      ? ['/learninghub/faqs', faq.categorySlug]
      : ['/learninghub/faqs'];
  }

  deleteFaq(faq: any) {
    if (!confirm(`Delete "${faq.question}"? This cannot be undone.`)) {
      return;
    }

    this.errorMessage = '';
    this.service.deleteFAQ(faq.faqid).subscribe({
      next: () => this.loadFaqs(),
      error: err => this.errorMessage = err?.error?.error
        || 'That FAQ could not be deleted. The API has no delete endpoint yet.'
    });
  }
}
