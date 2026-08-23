import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { AuthorService } from '../services/author.service';
import { toSlug } from '../utils/slug.util';
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

  /* ---------------- PAGINATION ---------------- */
  currentPage = 1;
  pageSize = 6; // number of cards per page

  /* ---------------- DATA (loaded from API) ---------------- */
  categories: any[] = [];   // [{ id, name, subs:[{id,name}] }]
  equipments: any[] = [];   // [{ equipmentID, title, shortDescription, slug, categoryIDs, ... }]

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: EquipmentService,
    private authorService: AuthorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Loads (and caches) the name-to-slug map the bylines link with.
    this.authorService.names().subscribe();

    this.service.getCategories().subscribe(res => {
      this.categories = this.service.buildCategoryTree(res);
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
            .map((c: any) => c.name)
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

  /* ---------------- CATEGORY TOGGLE ---------------- */
  selectMainCategory(id: number) {
    this.selectedMainCategoryId =
      this.selectedMainCategoryId === id ? null : id;
    this.selectedSubCategoryId = null;
    this.currentPage = 1;
  }

  selectSubCategory(id: number) {
    this.selectedSubCategoryId = id;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedMainCategoryId = null;
    this.selectedSubCategoryId = null;
    this.currentPage = 1;
  }
}
