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

  /**
   * Whether a load has finished — success or failure.
   *
   * The empty state must not appear while the questions are still on their
   * way, and several categories currently answer 500, so the error path has to
   * set this too or those pages would wait forever on a list that never comes.
   */
  faqsLoaded: boolean = false;
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
    this.faqsLoaded = false;

    this.postService.getAllFAQs(this.currentPage,
      this.pageSize,
      this.searchQuery, categoryID).subscribe({
      next: res => {
        this.faqs = res.faqs || [];
        this.totalCount = res.totalCount || 0;
        this.faqsLoaded = true;

        setTimeout(() => {
          const questions = this.el.nativeElement.querySelectorAll('.faq-question');

          questions.forEach((q: HTMLElement) => {
            q.addEventListener('click', () => {
              q.parentElement?.classList.toggle('active');
            });
          });
        }, 100)
      },
      // A category the API cannot serve reads the same as one with nothing in
      // it yet: an empty list, and the "Coming Soon" note below it.
      error: () => {
        this.faqs = [];
        this.totalCount = 0;
        this.faqsLoaded = true;
      }
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
            this.applyCategoryMeta(params['slug']);
            this.loadFAQs(params['slug']);
          }
          else {
            this.selectedCategoryId = null;
            this.loadFAQs("-1");
          }
        });
      });
  }
  /**
   * Title and description for a category URL.
   *
   * Built from the category's real name rather than the slug, so "youtube-seo"
   * is described as "YouTube SEO" and not "Youtube Seo". Also marks the
   * category active in the sidebar — the highlight the template reads.
   */
  private applyCategoryMeta(slug: string) {
    const category = this.categories.find(c => c.slug === slug);
    if (!category) return;

    this.selectedCategoryId = category.categoryID;

    this.seo.setPageMeta(
      `${category.name} FAQs for Creators | YT Creator`,
      `Answers to common ${category.name} questions for YouTube and social media ` +
      `creators, covering how it works and what to do when it does not.`,
      `${category.name} FAQs`
    );
  }

  onCategoryClick(category: any) {
    this.selectedCategory = category;
    const slug = toSlug(category);
    this.router.navigate(['/learninghub/faqs', slug]);
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
