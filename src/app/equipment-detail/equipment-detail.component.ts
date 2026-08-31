import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EquipmentService } from '../services/equipment.service';
import { SeoService } from '../services/seo.service';
import { AuthorService } from '../services/author.service';
import { toSlug } from '../utils/slug.util';
import { withPostDates } from '../utils/date.util';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css'],
  standalone: false
})
export class EquipmentDetailComponent implements OnInit {

  equipment: any = null;

  /** Other guides in the same categories, shown under the article. */
  relatedEquipment: any[] = [];

  /** Shows "Copied!" for a moment after the copy-link button is used. */
  copied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EquipmentService,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private authorService: AuthorService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  /** URL segment of the author page for the byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

  ngOnInit(): void {
    // Loads (and caches) the name-to-slug map the byline links with.
    this.authorService.names().subscribe();

    const slug = this.route.snapshot.paramMap.get('title');
    if (!slug) { return; }

    // The API has no "get by slug", so resolve the slug to an ID via the list,
    // then load the full record (which includes the description) by that ID.
    // publishedOnly: a scheduled guide must not be readable by URL before its
    // time — the list page hides it, so the detail page has to as well.
    this.service.getList(1, 1000, '', null, true).subscribe(list => {
      const match = (list.equipments || [])
        .find((e: any) => toSlug(e.title) === slug);
      if (!match) { return; }

      this.service.getById(match.equipmentID).subscribe(res => {
        if (!res) { return; }
        const cats = res.categories || [];
        const main = cats.find((c: any) => !c.parentCategoryID);
        const sub = cats.find((c: any) => c.parentCategoryID);

        // withPostDates turns the API's zone-less UTC values into real Dates
        // and works out whether an "Updated" stamp is worth showing.
        this.equipment = withPostDates({
          ...res,
          category: main?.name || '',
          // "Others" alone is meaningless, so it takes its parent's name.
          subCategory: sub
            ? this.service.subCategoryName(sub.name, main?.name || '')
            : '',
          // Description is HTML from the editor — trust it so it renders formatted.
          content: this.sanitizer.bypassSecurityTrustHtml(res.description || '')
        });

        // The guide supplies its own title and description, overriding the
        // route default AppComponent applied on navigation.
        // Third argument is the bare topic title - what a shared link shows.
        this.seo.setPageMeta(
          `${res.title} | Creator Equipment | YT Creator`,
          res.shortDescription,
          res.title
        );
      });

      this.loadRelated(match.equipmentID, slug);
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
