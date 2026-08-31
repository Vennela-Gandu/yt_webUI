import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { toSlug } from '../utils/slug.util';
import { SeoService } from '../services/seo.service';
import { withPostDates } from '../utils/date.util';
import { AuthorService } from '../services/author.service';


@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css'],
    standalone: false
})
export class BlogComponent {
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  searchQuery: string = '';
  posts: any[] = [];
  categories: any[] = [];
  isAdmin = false;
  selectedCategoryId: number | null = null;
  selectedCategory: string = '';
  constructor(private route: ActivatedRoute,
    private service: PostService,
    private router: Router,
    private authorService: AuthorService
  ,
    private seo: SeoService) {
    // Loads (and caches) the name-to-slug map the bylines link with.
    this.authorService.names().subscribe();

    // Detect admin route
    this.isAdmin = this.router.url.startsWith('/admin');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // If resolver provided posts (SSR), use them to populate the page source
    const resolved = this.route.snapshot.data['blogs'];
    if (resolved && resolved.posts) {
      this.posts = resolved.posts.map((c: any) => withPostDates({ ...c, slug: toSlug(c.title) }));
      this.totalCount = resolved.totalCount || this.posts.length;
    }

    this.loadCategories();

    
  }

  loadCategories() {
    this.service.getCategories('blog')
      .subscribe(res => {
        // "Trending" is a virtual category: posts ordered by how often they were opened.
        this.categories = [
          { categoryID: -2, name: 'Trending', slug: 'trending' },
          ...res.map(c => ({
            ...c,
            slug: toSlug(c.name)
          }))
        ];
        this.route.params.subscribe(params => {
          if (params['slug']) {
            this.currentPage = 1;
            this.selectedCategory = params['slug'];
            this.applyCategoryMeta(params['slug']);
            this.loadPosts(params['slug']);
          }
          else {
            this.loadPosts("-1");
          }
        });
      });
  }

  /**
   * Title and description for a category page.
   *
   * Built from the category's real name rather than the slug, so
   * "youtube-seo" reads as "YouTube SEO". Without this these pages fell
   * back to the site-wide default, which described none of them.
   */
  private applyCategoryMeta(slug: string) {
    const category = this.categories.find(c => c.slug === slug);
    if (!category) return;

    this.seo.setPageMeta(
      `${category.name} Articles & Guides | YT Creator`,
      `${category.name} articles for creators: practical guides, updates and ` +
      `tips you can act on, written from hands-on experience.`,
      category.name
    );
  }

  loadPosts(slug?: string) {
    if (slug === 'trending') {
      this.loadTrendingPosts();
      return;
    }
    var categoryID = -1;
    if (slug != "-1") {
      const category = this.categories.find(c => c.slug === slug);
      if (category) {
        categoryID = category.categoryID;
       
      }
    }
    this.service.getPostsByCategory(this.currentPage,
      this.pageSize,
      this.searchQuery, categoryID)
      .subscribe(res => {
        this.totalCount = res.totalCount;
        this.posts = res.posts.map((c: any) =>
          withPostDates({ ...c, slug: toSlug(c.title) })
        );
      });

  }
  loadTrendingPosts() {
    this.service.getTrendingPosts(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe(res => {
        this.totalCount = res.totalCount;
        this.posts = res.posts.map((c: any) =>
          withPostDates({ ...c, slug: toSlug(c.title) })
        );
      });
  }

  onCategoryClick(category: any) {
    this.selectedCategory = category;
    const slug = toSlug(category);
    this.router.navigate(['/blog', slug]);
  }

  editPost(postId: number) {
    this.router.navigate(['/admin/edit-post', postId]);
  }



  ngOnInit() {
    // Read the 'q' parameter from the URL on load
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadPosts(this.selectedCategory);
  }
  clear() {
    this.currentPage = 1;
    this.searchQuery = "";
    this.loadPosts("-1");
   

  }
  performSearch(query: string) {
    // Call your .NET API service here
    console.log('Searching for:', query);
  }

  openPost(name: any) {
    if (name != "-1") {
       const postdetail = this.posts.find(c => c.slug === name);
      if (postdetail) {
        this.router.navigate(['/blog', name, postdetail.postID]);

      }
    }
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPosts(this.selectedCategory);
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  /** URL segment of the author page for a byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

}
