import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../services/equipment.service';
import { toSlug } from '../utils/slug.util';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css'],
  standalone: false
})
export class EquipmentListComponent implements OnInit {

  /* ================= FILTERS ================= */
  searchText = '';
  selectedCategory = '';
  selectedSubCategory = '';
  selectedStatus = '';

  /* ================= PAGINATION ================= */
  // Ten per page, matching the blog and FAQ lists.
  pageSize = 10;
  currentPage = 1;

  /* ================= DATA (loaded from API) ================= */
  equipments: any[] = [];
  categories: string[] = [];
  subCategories: string[] = [];
  statuses = ['Published', 'Scheduled', 'Draft'];

  constructor(private service: EquipmentService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadEquipments();
  }

  loadCategories() {
    this.service.getCategories().subscribe(res => {
      this.categories = (res || []).filter((c: any) => !c.parentCategoryID).map((c: any) => c.name);
      this.subCategories = (res || []).filter((c: any) => c.parentCategoryID).map((c: any) => c.name);
    });
  }

  loadEquipments() {
    // Admin sees everything (drafts/scheduled too); filter/paginate client-side.
    this.service.getList(1, 1000, '', null, false).subscribe(res => {
      this.equipments = (res.equipments || []).map((e: any) => {
        const cats = e.categories || [];
        const main = cats.find((c: any) => !c.parentCategoryID);
        const sub = cats.find((c: any) => c.parentCategoryID);
        return {
          id: e.equipmentID,
          title: e.title,
          mainCategory: main?.name || '',
          subCategory: sub?.name || '',
          status: e.status,
          publishDate: e.publishedDate ? e.publishedDate.substring(0, 10) : '',
          slug: toSlug(e.title)
        };
      });
    });
  }

  /* ================= FILTER LOGIC ================= */
  get filteredEquipments() {
    return this.equipments.filter(e => {

      const matchesTitle =
        !this.searchText ||
        e.title.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || e.mainCategory === this.selectedCategory;

      const matchesSubCategory =
        !this.selectedSubCategory || e.subCategory === this.selectedSubCategory;

      const matchesStatus =
        !this.selectedStatus || e.status === this.selectedStatus;

      return (
        matchesTitle &&
        matchesCategory &&
        matchesSubCategory &&
        matchesStatus
      );
    });
  }

  /* ================= PAGINATION ================= */
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
    }
  }

  resetFilters() {
    this.searchText = '';
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.selectedStatus = '';
    this.currentPage = 1;
  }

  deleteEquipment(id: number) {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.service.delete(id).subscribe(() => {
        this.equipments = this.equipments.filter(e => e.id !== id);
      });
    }
  }
}
