import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { SeoService } from '../services/seo.service';
import { toSlug } from '../utils/slug.util';

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
  statuses: string[] = ['Published', 'Draft'];

  constructor(private blogService: BlogService, private seo: SeoService) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getBlogs().subscribe(res => {
     
      
       this.blogs = res.posts.map((c:any) => ({
                ...c,
                slug: toSlug(c.title)
              }));
        this.categories = [...new Set(this.blogs.map(x => x.category))];
      this.applyFilters();
      // Publish JSON-LD for blog list on client-side navigation
    
    });
  }

  applyFilters() {
    this.filteredBlogs = this.blogs.filter(blog => {

      const matchesTitle =
        !this.searchTitle ||
        blog.title.toLowerCase().includes(this.searchTitle.toLowerCase());

      const matchesCategory =
        !this.selectedCategory ||
        blog.category === this.selectedCategory;

      const matchesStatus =
        !this.selectedStatus ||
        blog.status === this.selectedStatus;

      const matchesDate =
        !this.selectedDate ||
        new Date(blog.publishedDate).toDateString() ===
        new Date(this.selectedDate).toDateString();

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

  deleteBlog(id: number) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe(() => {
        this.loadBlogs();
      });
    }
  }
}
