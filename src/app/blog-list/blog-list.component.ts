import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { toSlug } from '../utils/slug.util';
import { withPostDates } from '../utils/date.util';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
  standalone: false
})
export class BlogListComponent implements OnInit {

  blogs: any[] = [];
  filteredBlogs: any[] = [];

  // Filters
  searchTitle: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectedDate: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  categories: string[] = [];
  statuses: string[] = ['Published', 'Scheduled', 'Draft'];

  isLoading = true;
  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogService.getBlogs().subscribe({
      next: rows => {
        this.blogs = (rows || []).map((p: any) =>
          withPostDates({ ...p, slug: toSlug(p.title) })
        );

        // A post can sit in several categories; the proc returns them as
        // "News, Tips", so split them out for the filter dropdown.
        this.categories = [...new Set(
          this.blogs
            .flatMap(b => (b.categories || '').split(','))
            .map((c: string) => c.trim())
            .filter((c: string) => !!c)
        )].sort();

        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'The blog list could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredBlogs = this.blogs.filter(blog => {

      const matchesTitle =
        !this.searchTitle ||
        (blog.title || '').toLowerCase().includes(this.searchTitle.toLowerCase());

      const matchesCategory =
        !this.selectedCategory ||
        (blog.categories || '')
          .split(',')
          .map((c: string) => c.trim())
          .includes(this.selectedCategory);

      const matchesStatus =
        !this.selectedStatus ||
        blog.status === this.selectedStatus;

      const matchesDate =
        !this.selectedDate ||
        (blog.publishedDate &&
          blog.publishedDate.toDateString() ===
          new Date(this.selectedDate + 'T00:00:00').toDateString());

      return matchesTitle && matchesCategory && matchesStatus && matchesDate;
    });

    this.totalPages = Math.ceil(this.filteredBlogs.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedBlogs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBlogs.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearFilters() {
    this.searchTitle = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedDate = '';
    this.applyFilters();
  }

  addPost() {
    this.router.navigate(['/admin/add-post']);
  }

  editBlog(blog: any) {
    this.router.navigate(['/admin/edit-post', blog.postID]);
  }

  /** Opens the live post in a new tab; only meaningful once it is public. */
  viewUrl(blog: any): string[] {
    return ['/blog', blog.slug, blog.postID];
  }

  deleteBlog(blog: any) {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) {
      return;
    }

    this.errorMessage = '';
    this.blogService.deleteBlog(blog.postID).subscribe({
      next: () => this.loadBlogs(),
      error: err => this.errorMessage = err?.error?.error
        || 'That post could not be deleted.'
    });
  }
}
