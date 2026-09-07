import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSlug } from '../utils/slug.util';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { withPostDates } from '../utils/date.util';
import { prepareArticleBody } from '../utils/article-html.util';
import { shareImageFor } from '../utils/share-image';
import { SeoService } from '../services/seo.service';
import { AuthorService } from '../services/author.service';
import { ReactionsService, ReactionType } from '../services/reactions.service';

@Component({
  selector: 'app-post-detail',
  standalone:false,
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: any;

  /** True until the article arrives, so the page shows a spinner not a blank. */
  isLoading = true;
  categories: any[] = [];
  searchQuery: string = '';
  content!: SafeHtml;
  copied: boolean | undefined;
  selectedCategoryId: number | null = null;
  // Related posts come from the API; prev/next and "latest" are not wired up
  // yet, so they start empty rather than holding invented article titles.
  @Input() prevPost: any = null;
  @Input() nextPost: any = null;
  latestPosts: any[] = [];
  relatedPosts: any[] = [];

  /** The single article suggested to read next, from the related list. */
  readNext: any = null;

  /** The newest published article, whichever category it belongs to. */
  latestPost: any = null;

  /** Newest-first candidates for that slot, minus the article being read. */
  private latestCandidates: any[] = [];

  /* ---------------- REACTIONS ---------------- */

  likes = 0;
  dislikes = 0;

  /** This viewer's own choice, remembered so they cannot vote twice. */
  myReaction: ReactionType | null = null;

  /** Dislike counts are for the admin only; likes are public. */
  isAdmin = false;


 
 
  constructor(
    private route: ActivatedRoute, private router: Router,
    private service: PostService,
    private sanitizer: DomSanitizer,@Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private seo: SeoService,
    private authorService: AuthorService,
    private reactions: ReactionsService
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
       this.loadRelatedPosts(id);
     } else {
       // Fallback: fetch on client
       this.getPostById(id);
       this.loadRelatedPosts(id);
     }

     this.loadLatestPost(id);

     // Browser only: the counts are per-visitor state, and SSR has neither a
     // localStorage to read the previous vote from nor a reason to fetch them.
     if (isPlatformBrowser(this.platformId) && id) {
       this.isAdmin = this.reactions.isAdmin();
       this.myReaction = this.reactions.remembered('post', id);
       this.loadReactions(id);
     }
  }

  /**
   * The newest article on the site, skipping this one so the suggestion never
   * points at the page the reader is already on.
   */
  private loadLatestPost(currentId: number) {
    // categoryId -1 means "every category" to sp_Post_ByCategory.
    this.service.getPostsByCategory(1, 5, '', -1).subscribe({
      next: res => {
        this.latestCandidates = (res?.posts || [])
          .filter((p: any) => p.postID !== currentId)
          .map((p: any) => ({ ...p, slug: toSlug(p.title) }));

        this.pickLatestPost();
      },
      // A failure leaves the suggestion out; it is not worth an error message.
      error: () => { this.latestCandidates = []; this.latestPost = null; }
    });
  }

  /**
   * The newest article that "Read Next" is not already offering.
   *
   * Called from both loads because either can finish first: the newest post is
   * frequently the top related one too, and showing it twice side by side
   * wastes one of the two suggestions.
   */
  private pickLatestPost() {
    this.latestPost = this.latestCandidates
      .find(p => p.postID !== this.readNext?.postID) || null;
  }

  private loadReactions(id: number) {
    this.reactions.counts('post', id).subscribe({
      next: res => {
        this.likes = res?.likes || 0;
        this.dislikes = res?.dislikes || 0;
      },
      // The counts stay at their starting value, so the tally beside the Like
      // button still renders rather than vanishing on a failed request.
      error: () => { }
    });
  }

  /** Records a like or dislike, or withdraws one already given. */
  react(type: ReactionType) {
    const id = this.post?.postID;
    if (!id || !isPlatformBrowser(this.platformId)) return;

    // Clicking the same button again withdraws the vote.
    const next = this.myReaction === type ? null : type;

    const counts = this.reactions.applyChange(
      { likes: this.likes, dislikes: this.dislikes }, this.myReaction, next);
    this.likes = counts.likes;
    this.dislikes = counts.dislikes;

    this.myReaction = next;
    this.reactions.remember('post', id, next);

    if (next) {
      this.reactions.submit('post', id, next).subscribe({ error: () => { } });
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

        // The first related article is promoted to "Read Next" and dropped
        // from the list below, so the same post is never offered twice.
        this.readNext = this.relatedPosts[0] || null;
        this.relatedPosts = this.relatedPosts.slice(1);
        this.pickLatestPost();
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
    this.isLoading = false;
    if (!res) return;

    // Real Date objects (the API sends UTC without a suffix) plus the
    // wasUpdated flag the byline needs.
    this.post = withPostDates(res);

    // The post supplies its own title and description, overriding the route
    // default AppComponent applied on navigation.
    // Third argument is the bare topic title - what a shared link shows.
    this.seo.setPageMeta(
      `${this.post.title} | YT Creator`,
      this.post.shortDescription,
      this.post.title
    );

    // A shared link carries the article's picture, the way a video link
    // carries its thumbnail.
    this.seo.setShareImage(shareImageFor(res, res.description));

    // The editor saves HTML. Older posts were written as Markdown, so only
    // those go through marked — running HTML through it mangles tables and
    // image figures. marked is 40 KB and almost every post is HTML now, so it
    // is imported only when a Markdown post actually turns up.
    const raw = this.post.description || '';
    const html = this.looksLikeHtml(raw)
      ? raw
      : await import('marked').then(m => m.marked.parse(raw));
    this.content = this.sanitizer.bypassSecurityTrustHtml(prepareArticleBody(html));
  }

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
      this.router.navigate(['/blog', cname]);

    }
  }
}
