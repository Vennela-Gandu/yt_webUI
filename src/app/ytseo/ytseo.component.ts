import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ContentResponse } from '../models/content.model';
import { isPlatformBrowser } from '@angular/common';
import { PostService } from '../post.service';
import { EquipmentService } from '../services/equipment.service';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { toSlug } from '../utils/slug.util';
import { YTSEO_FAQS } from '../utils/ytseo-faqs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
    selector: 'app-ytseo',
    templateUrl: './ytseo.component.html',
    styleUrls: ['./ytseo.component.css'],
    standalone: false
})
export class YtseoComponent implements OnInit {
  title = 'YouTube Content Generator';
  generatedContent: ContentResponse | null = null;

  /** Posts from the YouTube SEO category, teased below the guide. */
  latestPosts: TeaserItem[] = [];

  /** The newest published equipment guides. */
  latestEquipment: TeaserItem[] = [];

  /** The shared list, plus the expand/collapse state the accordion needs. */
  faqs: FAQ[] = YTSEO_FAQS.map(faq => ({ ...faq, isOpen: false }));

  /** How many of each teaser the page shows. */
  private readonly latestCount = 5;

  /** "YouTube SEO" in the blog category list — the only posts relevant here. */
  private readonly youtubeSeoCategoryId = 17;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private posts: PostService,
    private equipment: EquipmentService) {}

  ngOnInit(): void {
    this.posts.getPostsByCategory(1, this.latestCount, '', this.youtubeSeoCategoryId)
      // An API hiccup must not take the page down with it: each teaser hides
      // itself when its list is empty.
      .pipe(catchError(() => of({ posts: [] })))
      .subscribe(res => {
        this.latestPosts = (res?.posts || []).map((p: any) => ({
          title: p.title,
          // The list endpoint returns no slug; the blog page derives it from
          // the title the same way, and the post route is keyed on it.
          link: ['/blog', toSlug(p.title), p.postID]
        }));
      });

    // publishedOnly, so a scheduled guide never surfaces here.
    this.equipment.getList(1, this.latestCount, '', null, true)
      .pipe(catchError(() => of({ equipments: [] })))
      .subscribe(res => {
        this.latestEquipment = (res?.equipments || []).map((e: any) => ({
          title: e.title,
          link: ['/equipment-detail', toSlug(e.title)]
        }));
      });
  }

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  onContentGenerated(content: ContentResponse) {
    this.generatedContent = content;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }
}
