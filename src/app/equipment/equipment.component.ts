import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
  standalone: false
})
export class EquipmentComponent {

  /* ---------------- SEARCH & FILTER ---------------- */
  searchText = '';
  selectedMainCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;

  /* ---------------- PAGINATION ---------------- */
  currentPage = 1;
  pageSize = 6; // number of cards per page

  /* ---------------- CATEGORIES ---------------- */
  categories = [
    {
      id: 1,
      name: 'Camera Equipment',
      subs: [
        { id: 101, name: 'Smartphone' },
        { id: 102, name: 'DSLR / Mirrorless Cameras' },
        { id: 103, name: 'Webcams' }
      ]
    },
    {
      id: 2,
      name: 'Audio Equipment',
      subs: [
        { id: 201, name: 'USB Microphones' },
        { id: 202, name: 'Shotgun Microphones' }
      ]
    },
    {
      id: 3,
      name: 'Lighting Equipment',
      subs: [
        { id: 301, name: 'Ring Lights' },
        { id: 302, name: 'Softbox Lights' }
      ]
    }
  ];

  /* ---------------- EQUIPMENT DATA ---------------- */
  equipments = [
    {
      title: 'Best Ring Lights for YouTube Creators',
      shortDescription: 'Top ring lights for creators.',
      subCategoryId: 301,
      slug: 'best-ring-lights-for-youtube-creators'
    },
    {
      title: 'USB Microphones Under ₹10,000',
      shortDescription: 'Affordable microphones for clear audio.',
      subCategoryId: 201,
      slug: 'usb-microphones-under-10000'
    },
    {
      title: 'Best Webcams for Online Teaching',
      shortDescription: 'Best webcams for Zoom & Meet.',
      subCategoryId: 103,
      slug: 'best-webcams-online-teaching'
    },
    {
      title: 'DSLR Cameras for Beginners',
      shortDescription: 'Beginner friendly DSLR cameras.',
      subCategoryId: 102,
      slug: 'dslr-cameras-for-beginners'
    },
    {
      title: 'Shotgun Mics for Vlogging',
      shortDescription: 'Best shotgun microphones.',
      subCategoryId: 202,
      slug: 'shotgun-mics-for-vlogging'
    },
    {
      title: 'Softbox Lighting Setup',
      shortDescription: 'Professional lighting setups.',
      subCategoryId: 302,
      slug: 'softbox-lighting-setup'
    }
  ];

  /* ---------------- FILTERED DATA ---------------- */
  get filteredEquipments() {
    return this.equipments.filter(e =>
      (!this.searchText ||
        e.title.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedSubCategoryId ||
        e.subCategoryId === this.selectedSubCategoryId)
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
constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if(isPlatformBrowser(this.platformId)){
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
