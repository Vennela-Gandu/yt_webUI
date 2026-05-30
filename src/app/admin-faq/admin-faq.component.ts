import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Base64UploadPlugin } from '../utils/base64-upload.adapter';

@Component({
  selector: 'app-admin-faq',
  standalone:false,
  templateUrl: './admin-faq.component.html',
  styleUrls: ['./admin-faq.component.css']
})
export class AdminFaqComponent implements OnInit {
  public Editor: any = null;
  public editorConfig = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'underline', 'link',
      'bulletedList', 'numberedList',
      'blockQuote', '|',
      'imageUpload',
      'undo', 'redo'
    ],
    extraPlugins: [Base64UploadPlugin]

  };


  faq: any = { question: '', answer: '', categoryIDs: [] as number[] };
  isEdit = false;
  faqId: number | null = null;
  categories: any[] = [];
  constructor(
    private service: PostService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCategories()
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.faqId = +id;
      this.service.getFAQById(this.faqId)

        .subscribe(res => {
          if (res?.categoryIDs) {
            res.categoryIDs = res.categoryIDs
              .split(',')
              .map((v: string) => Number(v.trim()))
              .filter((n: number) => !isNaN(n));
          }
          else {
            res.categoryIDs= [] as number[]
          }
          this.faq = res;
        })
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('@ckeditor/ckeditor5-build-classic').then((m) => {
        this.Editor = m?.default || m;
      }).catch(() => {});
    }
  }
  loadCategories(): void {
    this.service.getCategories('faq')
      .subscribe(res => this.categories = res);
  }

  onCategoryToggle(categoryID: number, event: any): void {
    if (event.target.checked) {
      this.faq.categoryIDs.push(categoryID);
    } else {
      this.faq.categoryIDs = this.faq.categoryIDs.filter(
        (id: number) => id !== categoryID
      );
    }
  }
  save() {
    if (this.faq.categoryIDs?.length > 0) {
      this.faq.categoryIDs = this.faq.categoryIDs.join(', ');
    }
    if (this.isEdit) {
      this.service.updateFAQ(this.faqId!, this.faq).subscribe({
        next: () => {
          alert('FAQ Updated');

          // reset form after update
          this.faq = {
            question: '',
            answer: '',
            status: true, categoryIDs: [] as number[],
          };
          this.isEdit = false;
          this.faqId = null;
        }
      });
    } else {
      this.service.addFAQ(this.faq).subscribe({
        next: () => {
          alert('FAQ Added');

          // reset form after add
          this.faq = {
            question: '',
            answer: '',
            status: true,
            categoryIDs: [] as number[],
          };
        }
      });
    }
  }

}


