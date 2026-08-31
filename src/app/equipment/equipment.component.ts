import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { AuthorService } from '../services/author.service';
import { toSlug } from '../utils/slug.util';
import { SeoService } from '../services/seo.service';
import { withPostDates } from '../utils/date.util';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
  standalone: false
})
export class EquipmentComponent implements OnInit {

  /* ---------------- SEARCH & FILTER ---------------- */
  searchText = '';
  selectedMainCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;

  /** The category slug from the URL, e.g. "dslr-mirrorless-cameras". */
  private categorySlug: string | null = null;

  /* ---------------- PAGINATION ---------------- */
  currentPage = 1;
  pageSize = 12; // number of cards per page

  /* ---------------- DATA (loaded from API) ---------------- */
  categories: any[] = [];   // [{ id, name, subs:[{id,name}] }]
  equipments: any[] = [];   // [{ equipmentID, title, shortDescription, slug, categoryIDs, ... }]

  /** Edit buttons appear when this page is opened from /admin. */
  isAdmin = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: EquipmentService,
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    // The same check /admin/blog uses: one component, two audiences.
    this.isAdmin = this.router.url.startsWith('/admin');

    // Loads (and caches) the name-to-slug map the bylines link with.
    this.authorService.names().subscribe();

    this.service.getCategories().subscribe(res => {
      this.categories = this.service.buildCategoryTree(res);
      this.applyCategoryFromUrl();
    });

    // The categories and the URL arrive independently, so both call the
    // same method and it copes with being run before the other lands.
    this.route.paramMap.subscribe(params => {
      this.categorySlug = params.get('category');
      this.currentPage = 1;
      this.applyCategoryFromUrl();
    });

    // Published items only; load all and paginate client-side (same UX as before).
    this.service.getList(1, 1000, '', null, true).subscribe(res => {
      this.equipments = (res.equipments || []).map((e: any) =>
        withPostDates({
          equipmentID: e.equipmentID,
          title: e.title,
          shortDescription: e.shortDescription,
          slug: toSlug(e.title),
          authorName: e.authorName,
          publishedDate: e.publishedDate,
          updatedDate: e.updatedDate,
          categoryIDs: (e.categories || []).map((c: any) => c.categoryID),
          // Sub categories only: the main category name would repeat on every
          // card in a section and adds nothing to the card.
          categoryNames: (e.categories || [])
            .filter((c: any) => c.parentCategoryID)
            // A tag reading just "Others" says nothing; name it after its
            // parent, exactly as the sidebar does.
            .map((c: any) => this.service.subCategoryName(
              c.name,
              (e.categories || []).find(
                (p: any) => p.categoryID === c.parentCategoryID)?.name || ''))
        })
      );
    });
  }

  /* ---------------- FILTERED DATA ---------------- */
  get filteredEquipments() {
    return this.equipments.filter(e =>
      (!this.searchText ||
        e.title.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedSubCategoryId ||
        e.categoryIDs.includes(this.selectedSubCategoryId))
    );
  }

  /* ---------------- PAGINATED DATA ---------------- */
  get paginatedEquipments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEquipments.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredEquipments.length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  /** The whole card is clickable, the same as a blog post card. */
  openEquipment(item: any) {
    this.router.navigate(['/equipment-detail', item.slug]);
  }

  /** URL segment of the author page for a byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

  /** Opens this guide in the admin editor. */
  editEquipment(equipmentID: number) {
    this.router.navigate(['/admin/equipment-form', equipmentID]);
  }

  /** The URL segment for a category name. */
  categorySlugOf(name: string): string {
    return toSlug(name || '');
  }

  /**
   * Narrows the list to the category named in the URL.
   *
   * Matches a sub-category first, then a main one: equipment records carry
   * both ids, so filtering on either works. An unknown slug simply lists
   * everything rather than showing an empty page.
   */
  private applyCategoryFromUrl() {
    if (!this.categorySlug) {
      this.selectedSubCategoryId = null;
      this.selectedMainCategoryId = null;
      return;
    }

    if (!this.categories.length) return;

    for (const cat of this.categories) {
      const sub = (cat.subs || []).find(
        (s: any) => toSlug(s.name) === this.categorySlug);

      if (sub) {
        this.selectedSubCategoryId = sub.id;
        // Open the parent so the selected entry is visible in the sidebar.
        this.selectedMainCategoryId = cat.id;
        this.applyCategoryMeta(sub.name);
        return;
      }

      if (toSlug(cat.name) === this.categorySlug) {
        this.selectedSubCategoryId = cat.id;
        this.selectedMainCategoryId = cat.id;
        this.applyCategoryMeta(cat.name);
        return;
      }
    }
  }

  /** Title and description built from the category's real name. */
  private applyCategoryMeta(name: string) {
    this.seo.setPageMeta(
      `${name} for Creators | YT Creator`,
      `Reviews and buying guides for ${name.toLowerCase()} — what to look for, ` +
      `what each option is good at, and which suits your budget and content.`,
      name
    );
  }

  /* ---------------- CATEGORY TOGGLE ---------------- */
  selectMainCategory(id: number) {
    this.selectedMainCategoryId =
      this.selectedMainCategoryId === id ? null : id;
    this.selectedSubCategoryId = null;
    this.currentPage = 1;
  }

  /** Each sub-category is its own page, so this is a navigation. */
  selectSubCategory(name: string) {
    this.router.navigate(['/equipment', this.categorySlugOf(name)]);
  }

  clearFilters() {
    this.searchText = '';
    this.currentPage = 1;

    // The category lives in the URL, so clearing it is a navigation back to
    // the unfiltered list; the param subscription resets the selection.
    this.router.navigate(['/equipment']);
  }
}
