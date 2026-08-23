import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSlug } from '../utils/slug.util';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { withPostDates } from '../utils/date.util';
import { SeoService } from '../services/seo.service';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-post-detail',
  standalone:false,
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: any;
  categories: any[] = [];
  searchQuery: string = '';
  content!: SafeHtml;
  copied: boolean | undefined;
  selectedCategoryId: number | null = null;
  @Input() prevPost: any = { slug: 'old-post', title: 'Previous Post Title' };
  @Input() nextPost: any = { slug: 'new-post', title: 'Next Post Title' };

  latestPosts = [
    { slug: 'latest-1', title: 'How to use Angular' },
    { slug: 'latest-2', title: 'CSS Tips and Tricks' }
  ];
  relatedPosts: any[] = [];

 
 
  constructor(
    private route: ActivatedRoute, private router: Router,
    private service: PostService,
    private sanitizer: DomSanitizer,@Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private seo: SeoService,
    private authorService: AuthorService
  ) {
    // Loads (and caches) the name-to-slug map the byline links with.
    this.authorService.names().subscribe();
  }

  /**
   * Opens the platform's share dialog in a new tab. The URL and title are
   * encoded, so a title with & or ? does not truncate the link.
   */
  share(platform: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = encodeURIComponent(this.document.location.href);
    const title = encodeURIComponent(this.post?.title || '');

    const targets: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`
    };

    const shareUrl = targets[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener');
    }
  }
  copyLink() {
    if(isPlatformBrowser(this.platformId)){
    const url = this.document.location.href;
    
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      // Hide the "Copied!" message after 2 seconds
      setTimeout(() => this.copied = false, 2000);
    });
  }
  }
   ngOnInit() {
     const id = Number(this.route.snapshot.paramMap.get('id'));
     this.loadCategories();

     // Count this open for the Trending list. Browser-only so SSR prerender
     // doesn't inflate the count; failures are non-blocking.
     if (isPlatformBrowser(this.platformId) && id) {
       this.service.recordView(id).subscribe({ error: () => { } });
     }

     // If the route resolver provided the post (SSR or resolved route), use it to avoid HTTP calls during server render
     const resolvedPost = this.route.snapshot.data['post'];
     if (resolvedPost) {
       this.setPost(resolvedPost);
      // If the resolver returned a prerender stub, and we're running in the browser, fetch the real post
      if (isPlatformBrowser(this.platformId) && resolvedPost?.prerenderStub) {
        this.getPostById(id);
      }
       this.loadRelatedPosts(id);
     } else {
       // Fallback: fetch on client
       this.getPostById(id);
       this.loadRelatedPosts(id);
     }
  }

  loadRelatedPosts(id:any) {
    if (!id) return;

    this.service
      .getRelatedPosts(id)
      .subscribe(res => {
        this.relatedPosts = res;
        
        this.relatedPosts = res.map((c: any) => ({
          ...c,
          slug: toSlug(c.title)
        }));
      });
  }
  openRelatedPost(name: any) {
    if (name != "-1") {
      const postdetail = this.relatedPosts.find(c => c.slug === name);
      if (postdetail) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/blog', name, postdetail.postID]);
        });

      }
    }
  }
   getPostById(id: number) {
    this.service.getPostById(id)
      .subscribe(async res => {
        this.setPost(res);
      });
  }

  private async setPost(res: any) {
    if (!res) return;

    // Real Date objects (the API sends UTC without a suffix) plus the
    // wasUpdated flag the byline needs.
    this.post = withPostDates(res);

    // The post supplies its own title and description, overriding the route
    // default AppComponent applied on navigation.
    this.seo.setPageMeta(
      `${this.post.title} | YT Creator`,
      this.post.shortDescription
    );

    // The editor saves HTML. Older posts were written as Markdown, so only
    // those go through marked — running HTML through it mangles tables and
    // image figures.
    const raw = this.post.description || '';
    const html = this.looksLikeHtml(raw) ? raw : await marked.parse(raw);
    this.content = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /** URL segment of the author page for the byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

  private looksLikeHtml(content: string): boolean {
    return /<(p|div|h[1-6]|ul|ol|li|table|figure|img|blockquote|span|strong|em)\b/i.test(content);
  }
  loadCategories() {
    this.service.getCategories('blog')
      .subscribe(res => {
        this.categories = res;
        this.categories = res.map(c => ({
          ...c,
          slug: toSlug(c.name)
        }));
      });
  }
  onSearch() {

  }
  loadPosts(cname?: string) {
    cname = cname ?? "-1";
    if (cname) {
      this.router.navigate(['/blog/category', cname]);

    }
  }
}
