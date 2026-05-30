import { Component } from '@angular/core';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css'],
  standalone: false
})
export class EquipmentListComponent {

  /* ================= FILTERS ================= */
  searchText = '';
  selectedCategory = '';
  selectedSubCategory = '';
  selectedStatus = '';
  fromDate = '';
  toDate = '';

  /* ================= PAGINATION ================= */
  pageSize = 5;
  currentPage = 1;

  /* ================= DATA ================= */
  equipments = [
    {
      id: 1,
      title: 'Best Ring Lights for YouTube',
      mainCategory: 'Lighting Equipment',
      subCategory: 'Ring Lights',
      status: 'Published',
      publishDate: '2026-01-20',
      slug: 'best-ring-lights-for-youtube'
    },
    {
      id: 2,
      title: 'USB Microphones Under ₹10,000',
      mainCategory: 'Audio Equipment',
      subCategory: 'USB Microphones',
      status: 'Scheduled',
      publishDate: '2026-02-05',
      slug: 'usb-microphones-under-10000'
    },
    {
      id: 3,
      title: 'DSLR vs Mirrorless Cameras',
      mainCategory: 'Camera Equipment',
      subCategory: 'DSLR / Mirrorless Cameras',
      status: 'Draft',
      publishDate: '',
      slug: 'dslr-vs-mirrorless'
    },
    {
      id: 4,
      title: 'Best Webcams for Online Classes',
      mainCategory: 'Camera Equipment',
      subCategory: 'Webcams',
      status: 'Published',
      publishDate: '2026-01-10',
      slug: 'best-webcams-online-classes'
    }
  ];

  categories = [
    'Camera Equipment',
    'Audio Equipment',
    'Lighting Equipment'
  ];

  subCategories = [
    'Ring Lights',
    'USB Microphones',
    'DSLR / Mirrorless Cameras',
    'Webcams'
  ];

  statuses = ['Published', 'Scheduled', 'Draft'];

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

      const matchesFromDate =
        !this.fromDate || (e.publishDate && e.publishDate >= this.fromDate);

      const matchesToDate =
        !this.toDate || (e.publishDate && e.publishDate <= this.toDate);

      return (
        matchesTitle &&
        matchesCategory &&
        matchesSubCategory &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
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
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
  }

  deleteEquipment(id: number) {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.equipments = this.equipments.filter(e => e.id !== id);
    }
  }
}
