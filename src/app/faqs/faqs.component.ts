import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSlug } from '../utils/slug.util';
import { SeoService } from '../services/seo.service';
interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
  faqid:number
}

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.css'],
    standalone: false
})

export class FaqsComponent implements OnInit {
  makeLinksClickable(text: string): string {
    if (!text) return '';

    // Case 1: If anchor tag already exists, trust it
    if (text.includes('<a ')) {
      return text;
    }

    // Case 2: Remove HTML tags like <p>, <br>, etc.
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, '');

    // Case 3: Convert plain URLs into clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return strippedText.replace(
      urlRegex,
      `<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`
    );
  }

  faqs: FAQ[] = [];
  currentPage = 1;
  pageSize = 30;
  totalCount = 0;
  searchQuery: string = '';
  posts: any[] = [];
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  selectedCategory: string = '';
  isAdmin: boolean = false;
  constructor(private el: ElementRef, private postService: PostService,
    private route: ActivatedRoute,

    private router: Router, private seo: SeoService) {
    this.isAdmin = this.router.url.startsWith('/admin')
  }
  ngOnInit(): void {
    this.loadCategories()
    //this.loadFAQs("-1");
  }

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
  loadFAQs(slug: any) {
    var categoryID = -1;
    if (slug != "-1") {
      const category = this.categories.find(c => c.slug === slug);
      if (category) {
        categoryID = category.categoryID;

      }
    }
    this.postService.getAllFAQs(this.currentPage,
      this.pageSize,
      this.searchQuery, categoryID).subscribe(res => {
      this.faqs = res.faqs;
      this.totalCount = res.totalCount;
      
      setTimeout(() => {
        const questions = this.el.nativeElement.querySelectorAll('.faq-question');

        questions.forEach((q: HTMLElement) => {
          q.addEventListener('click', () => {
            q.parentElement?.classList.toggle('active');
          });
        });
      }, 100)

    })
  }

  loadCategories() {
    this.postService.getCategories('faq')
      .subscribe(res => {
        this.categories = res
        this.categories = res.map(c => ({
          ...c,
          slug: toSlug(c.name)
        }));
        this.route.params.subscribe(params => {
          if (params['slug']) {
            this.currentPage = 1;
            this.selectedCategory = params['slug'];
            this.loadFAQs(params['slug']);
          }
          else {
            this.loadFAQs("-1");
          }
        });
      });
  }
  onCategoryClick(category: any) {
    this.selectedCategory = category;
    const slug = toSlug(category);
    this.router.navigate(['learninghub/faqs/category', slug]);
  }

  onSearch() {
    this.currentPage = 1;
    this.loadFAQs(this.selectedCategory);
  }
  clear() {
    this.currentPage = 1;
    this.searchQuery = "";
    this.loadFAQs("-1");


  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadFAQs(this.selectedCategory);
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  editFAQ(faqID: number) {
    this.router.navigate(['/admin/faq', faqID]);
  }


}
