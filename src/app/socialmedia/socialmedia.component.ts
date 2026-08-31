import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeaserService, BLOG_CATEGORY } from '../services/teaser.service';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { SOCIAL_MEDIA_FAQS } from '../utils/page-faqs';

@Component({
    selector: 'app-socialmedia',
    templateUrl: './socialmedia.component.html',
    styleUrls: ['./socialmedia.component.css'],
    standalone: false
})
export class SocialmediaComponent implements OnInit {
  /** Blog posts relevant to this page, teased below the content. */
  latestPosts: TeaserItem[] = [];

  /** The newest published equipment guides. */
  latestEquipment: TeaserItem[] = [];

  /** Questions shown in the FAQ block at the foot of the page. */
  pageFaqs = SOCIAL_MEDIA_FAQS;

  constructor(
    private router: Router,
    private teasers: TeaserService) {

  }

  ngOnInit(): void {
    this.teasers.postsIn(BLOG_CATEGORY.socialMedia)
      .subscribe(items => this.latestPosts = items);

    this.teasers.latestEquipment()
      .subscribe(items => this.latestEquipment = items);
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/socialmedia';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/socialmedia/'+section]);
  }
}
