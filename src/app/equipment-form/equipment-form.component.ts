import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Base64UploadPlugin } from '../utils/base64-upload.adapter';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css'],
  standalone: false
})
export class EquipmentFormComponent implements OnInit {

  public Editor: any = null;
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'fontFamily',
        'fontSize',
        '|',
        'bold',
        'italic',
        'underline',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'imageUpload',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },

    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Roboto, sans-serif',
        'Poppins, sans-serif',
        'Georgia, serif',
        'Times New Roman, Times, serif'
      ]
    },

    fontSize: {
      options: [12, 14, 16, 18, 20, 24, 32],
      supportAllValues: false
    },

    extraPlugins: [Base64UploadPlugin]
  };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  equipment: any = {
    equipmentID: null,
    title: '',
    keywords: '', 
    shortDescription: '',
    description: '',
    publishedDate: '',
    mainCategoryIDs: [],
    subCategoryIDs: []
  };

  // MAIN + SUB CATEGORY STRUCTURE
  categories = [
    {
      id: 1,
      name: 'Camera Equipment',
      subs: [
        { id: 101, name: 'Smartphone' },
        { id: 102, name: 'DSLR / Mirrorless Cameras' },
        { id: 103, name: 'Webcams' },
        { id: 104, name: 'Video Cameras' },
        { id: 105, name: 'Others' }
      ]
    },
    {
      id: 2,
      name: 'Audio Equipment',
      subs: [
        { id: 201, name: 'Lavalier Microphones' },
        { id: 202, name: 'USB Microphones' },
        { id: 203, name: 'Shotgun Microphones' },
        { id: 204, name: 'Wireless Microphones' },
        { id: 205, name: 'Others' }
      ]
    },
    {
      id: 3,
      name: 'Lighting Equipment',
      subs: [
        { id: 301, name: 'Ring Lights' },
        { id: 302, name: 'Softbox Lights' },
        { id: 303, name: 'LED Panels' },
        { id: 304, name: 'Others' }
      ]
    },
    {
      id: 4,
      name: 'Accessories & Support Gear',
      subs: [
        { id: 401, name: 'Tripods' },
        { id: 402, name: 'Gimbals' },
        { id: 403, name: 'Green Screens' },
        { id: 404, name: 'Others' }
      ]
    }
  ];

  // MAIN CATEGORY TOGGLE
  toggleMainCategory(catId: number, event: any) {
    if (!event.target.checked) {
      // Prevent unchecking if any sub category exists
      const hasSub = this.categories
        .find(c => c.id === catId)!
        .subs.some(s => this.equipment.subCategoryIDs.includes(s.id));

      if (hasSub) {
        event.target.checked = true;
        return;
      }

      this.equipment.mainCategoryIDs =
        this.equipment.mainCategoryIDs.filter((id: number) => id !== catId);
    } else {
      this.equipment.mainCategoryIDs.push(catId);
    }
  }

  // SUB CATEGORY TOGGLE
  toggleSubCategory(mainId: number, subId: number, event: any) {
    if (event.target.checked) {
      this.equipment.subCategoryIDs.push(subId);

      // AUTO select main category
      if (!this.equipment.mainCategoryIDs.includes(mainId)) {
        this.equipment.mainCategoryIDs.push(mainId);
      }
    } else {
      this.equipment.subCategoryIDs =
        this.equipment.subCategoryIDs.filter((id: number) => id !== subId);
    }
  }

  isFormValid(): boolean {
    return (
      this.equipment.title.trim() !== '' &&
      this.equipment.shortDescription.trim() !== '' &&
      this.equipment.description.trim() !== '' &&
      this.equipment.subcategoryIDs.length > 0
    );
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('@ckeditor/ckeditor5-build-classic').then((m) => {
        this.Editor = m?.default || m;
      }).catch(() => {
        // optional: keep Editor null if import fails on server or build
      });
    }
  }

  resetForm() {
    this.equipment = {
      equipmentID: null,
      title: '',
      shortDescription: '',
      description: '',
      publishedDate: '',
      mainCategoryIDs: [],
      subCategoryIDs: []
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  save() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // UI ONLY – just testing
    console.log('EQUIPMENT DATA:', this.equipment);

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = this.equipment.publishedDate
        ? 'Equipment scheduled successfully'
        : 'Equipment published successfully';
    }, 800);
  }
}
