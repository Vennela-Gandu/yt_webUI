import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EquipmentService } from '../services/equipment.service';
import { SeoService } from '../services/seo.service';
import { AuthorService } from '../services/author.service';
import { ReactionsService, ReactionType } from '../services/reactions.service';
import { toSlug } from '../utils/slug.util';
import { withPostDates } from '../utils/date.util';
import { prepareArticleBody } from '../utils/article-html.util';
import { shareImageFor } from '../utils/share-image';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css'],
  standalone: false
})
export class EquipmentDetailComponent implements OnInit {

  equipment: any = null;

  /**
   * True until the lookup finishes, either way.
   *
   * Without it the template's *ngIf="!equipment" was true from the first
   * frame, so every visitor saw "Equipment not found" flash before the
   * guide arrived.
   */
  isLoading = true;

  /** Other guides in the same categories, shown under the article. */
  relatedEquipment: any[] = [];

  /** Shows "Copied!" for a moment after the copy-link button is used. */
  copied = false;

  /* ---------------- REACTIONS ---------------- */

  likes = 0;
  dislikes = 0;

  /** This viewer's own choice, remembered so they cannot vote twice. */
  myReaction: ReactionType | null = null;

  /** Dislike counts are for the admin only; likes are public. */
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EquipmentService,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private authorService: AuthorService,
    private reactions: ReactionsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  private loadReactions(id: number) {
    this.reactions.counts('equipment', id).subscribe({
      next: res => {
        this.likes = res?.likes || 0;
        this.dislikes = res?.dislikes || 0;
      },
      // The counts keep their starting value rather than vanishing when the
      // request fails.
      error: () => { }
    });
  }

  /** Records a like or dislike, or withdraws one already given. */
  react(type: ReactionType) {
    const id = this.equipment?.equipmentID;
    if (!id || !isPlatformBrowser(this.platformId)) return;

    // Clicking the same button again withdraws the vote.
    const next = this.myReaction === type ? null : type;

    const counts = this.reactions.applyChange(
      { likes: this.likes, dislikes: this.dislikes }, this.myReaction, next);
    this.likes = counts.likes;
    this.dislikes = counts.dislikes;

    this.myReaction = next;
    this.reactions.remember('equipment', id, next);

    if (next) {
      this.reactions.submit('equipment', id, next).subscribe({ error: () => { } });
    }
  }

  /** URL segment of the author page for the byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

  ngOnInit(): void {
    // Loads (and caches) the name-to-slug map the byline links with.
    this.authorService.names().subscribe();

    const slug = this.route.snapshot.paramMap.get('title');
    if (!slug) { this.isLoading = false; return; }

    // The API has no "get by slug", so the slug is resolved against the list.
    // Fetching all 75 published guides to do it cost ~99 KB and over a second
    // before anything could render, so the first word of the slug is passed as
    // a search term: the same lookup against a handful of rows instead.
    // publishedOnly: a scheduled guide must not be readable by URL before its
    // time — the list page hides it, so the detail page has to as well.
    const searchTerm = slug.split('-')[0] || '';

    this.service.getList(1, 50, searchTerm, null, true).subscribe({
      error: () => { this.isLoading = false; },
      next: list => {
      const match = (list.equipments || [])
        .find((e: any) => toSlug(e.title) === slug);

      // The narrowed search missed it — a title whose first word differs from
      // the slug's. Fall back to the full list rather than claiming the guide
      // does not exist.
      if (!match) { this.resolveFromFullList(slug); return; }

      this.loadGuide(match.equipmentID, slug);
      }
    });
  }

  /**
   * The unnarrowed lookup, used only when the search term missed.
   *
   * Rare, so it is worth the larger request rather than telling a visitor a
   * guide is missing when it is not.
   */
  private resolveFromFullList(slug: string): void {
    this.service.getList(1, 1000, '', null, true).subscribe({
      error: () => { this.isLoading = false; },
      next: list => {
        const match = (list.equipments || [])
          .find((e: any) => toSlug(e.title) === slug);

        if (!match) { this.isLoading = false; return; }

        this.loadGuide(match.equipmentID, slug);
      }
    });
  }

  /** Loads one guide by id and renders it. */
  private loadGuide(id: number, slug: string): void {
    this.service.getById(id).subscribe({
      error: () => { this.isLoading = false; },
      next: res => {
        if (!res) { this.isLoading = false; return; }

        const cats = res.categories || [];
        const main = cats.find((c: any) => !c.parentCategoryID);
        const sub = cats.find((c: any) => c.parentCategoryID);

        // withPostDates turns the API's zone-less UTC values into real Dates
        // and works out whether an "Updated" stamp is worth showing.
        this.isLoading = false;
        this.equipment = withPostDates({
          ...res,
          category: main?.name || '',
          // "Others" alone is meaningless, so it takes its parent's name.
          subCategory: sub
            ? this.service.subCategoryName(sub.name, main?.name || '')
            : '',
          // Description is HTML from the editor — trust it so it renders formatted.
          content: this.sanitizer.bypassSecurityTrustHtml(prepareArticleBody(res.description || ''))
        });

        // The guide supplies its own title and description, overriding the
        // route default AppComponent applied on navigation.
        // Third argument is the bare topic title - what a shared link shows.
        this.seo.setPageMeta(
          `${res.title} | Creator Equipment | YT Creator`,
          res.shortDescription,
          res.title
        );

        // A shared link carries the guide's picture.
        this.seo.setShareImage(shareImageFor(res, res.description));

        // Browser only: the vote is per-visitor state, and SSR has no
        // localStorage to read a previous choice from.
        if (isPlatformBrowser(this.platformId)) {
          this.isAdmin = this.reactions.isAdmin();
          this.myReaction = this.reactions.remembered('equipment', id);
          this.loadReactions(id);
        }

        this.loadRelated(id, slug);
      }
    });
  }

  /** Same shape as the blog's related-posts list: five title links. */
  loadRelated(id: number, currentSlug: string): void {
    if (!id) { return; }

    this.service.getRelated(id, 8).subscribe({
      next: rows => {
        const seen = new Set<string>([currentSlug]);
        const list: any[] = [];

        for (const row of rows || []) {
          const slug = toSlug(row.title);
          // Two guides can share a title (the URL is built from it), which would
          // otherwise show the same link twice — or link back to this page.
          if (seen.has(slug)) { continue; }
          seen.add(slug);
          list.push({ ...row, slug });
          if (list.length === 5) { break; }
        }

        this.relatedEquipment = list;
      },
      error: () => this.relatedEquipment = []
    });
  }

  /**
   * Opens the platform's share dialog in a new tab. The URL and title are
   * encoded, so a title containing & or ? does not truncate the link.
   * Same behaviour as the blog post page.
   */
  share(platform: string): void {
    if (!isPlatformBrowser(this.platformId)) { return; }

    const url = encodeURIComponent(this.document.location.href);
    const title = encodeURIComponent(this.equipment?.title || '');

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

  /** Copies this page's URL, showing "Copied!" briefly. */
  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) { return; }

    navigator.clipboard.writeText(this.document.location.href).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  /**
   * Navigating between two /equipment-detail/:title URLs only changes a route
   * parameter, so Angular reuses the component and ngOnInit would not run
   * again. Bouncing through the root forces a fresh load — the same approach
   * the blog's related links use.
   */
  openRelated(item: any): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/equipment-detail', item.slug]);
    });
  }
}
