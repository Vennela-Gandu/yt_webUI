import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeaserService, BLOG_CATEGORY } from '../services/teaser.service';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { LEARNING_HUB_FAQS } from '../utils/page-faqs';

@Component({
    selector: 'app-learninghub',
    templateUrl: './learninghub.component.html',
    styleUrls: ['./learninghub.component.css'],
    standalone: false
})
export class LearninghubComponent implements OnInit {
  /** Blog posts relevant to this page, teased below the content. */
  latestPosts: TeaserItem[] = [];

  /** The newest published equipment guides. */
  latestEquipment: TeaserItem[] = [];

  /** Questions shown in the FAQ block at the foot of the page. */
  pageFaqs = LEARNING_HUB_FAQS;

  constructor(
    private router: Router,
    private teasers: TeaserService) {
  }

  ngOnInit(): void {
    this.teasers.postsIn(BLOG_CATEGORY.learningHub)
      .subscribe(items => this.latestPosts = items);

    this.teasers.latestEquipment()
      .subscribe(items => this.latestEquipment = items);
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/learninghub';
  }
  // Takes a full route path: Equipment lives at the root, not under /learninghub.
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
