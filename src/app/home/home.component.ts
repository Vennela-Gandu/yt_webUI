import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';
import { PostService } from '../post.service';
import { EquipmentService } from '../services/equipment.service';
import { toSlug } from '../utils/slug.util';
import { HOME_FAQS } from '../utils/home-faqs';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {

  /** The newest published posts, teased above the FAQ. */
  latestPosts: TeaserItem[] = [];

  /** The newest published equipment guides, teased below the posts. */
  latestEquipment: TeaserItem[] = [];

  /** How many of each the home page shows. */
  private readonly latestCount = 5;

  constructor(
    private router: Router,
    private seo: SeoService,
    private posts: PostService,
    private equipment: EquipmentService) {

  }

  ngOnInit(): void {
    // categoryId -1 means "every category" to sp_Post_ByCategory — the same
    // public, published-only list the blog page is built from.
    this.posts.getPostsByCategory(1, this.latestCount, '', -1)
      // A blog API hiccup must not take the home page down with it: the
      // section hides itself when the list is empty.
      .pipe(catchError(() => of({ posts: [] })))
      .subscribe(res => {
        this.latestPosts = (res?.posts || []).map((p: any) => ({
          title: p.title,
          // The list endpoint returns no slug — the blog page derives it from
          // the title the same way, and the post route is keyed on it.
          link: ['/blog', toSlug(p.title), p.postID]
        }));
      });

    // publishedOnly, so a scheduled guide never surfaces on the home page.
    this.equipment.getList(1, this.latestCount, '', null, true)
      .pipe(catchError(() => of({ equipments: [] })))
      .subscribe(res => {
        this.latestEquipment = (res?.equipments || []).map((e: any) => ({
          title: e.title,
          // The detail route is keyed by the slug of the title, exactly as the
          // equipment list page builds it.
          link: ['/equipment-detail', toSlug(e.title)]
        }));
      });
  }

  features: Feature[] = [
    {
      icon: '🛠️',
      title: 'Creator-focused tools',
      description: 'Tools designed around YouTube and social media workflows.'
    },
    {
      icon: '📘',
      title: 'Practical resources',
      description: 'Guides written to help creators solve real publishing and growth problems.'
    },
    {
      icon: '✍️',
      title: 'Human-reviewed content',
      description: 'Articles are reviewed and edited before publication.'
    },
    {
      icon: '🎁',
      title: 'Free creator resources',
      description: 'Useful tools and educational resources without unnecessary complexity.'
    }
  ];

  /** The shared list, plus the expand/collapse state the accordion needs. */
  faqs: FAQ[] = HOME_FAQS.map(faq => ({ ...faq, isOpen: false }));

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate([section]);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

