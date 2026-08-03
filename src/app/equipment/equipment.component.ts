import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EquipmentService } from '../services/equipment.service';
import { toSlug } from '../utils/slug.util';

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
  equipments: any[] = [];   // [{ equipmentID, title, shortDescription, slug, categoryIDs:number[] }]

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: EquipmentService
  ) { }

  ngOnInit(): void {
    this.service.getCategories().subscribe(res => {
      this.categories = this.service.buildCategoryTree(res);
    });

    // Published items only; load all and paginate client-side (same UX as before).
    this.service.getList(1, 1000, '', null, true).subscribe(res => {
      this.equipments = (res.equipments || []).map((e: any) => ({
        equipmentID: e.equipmentID,
        title: e.title,
        shortDescription: e.shortDescription,
        slug: toSlug(e.title),
        categoryIDs: (e.categories || []).map((c: any) => c.categoryID)
      }));
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
