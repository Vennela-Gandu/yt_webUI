import { Component, OnInit } from '@angular/core';
import { TeaserService, BLOG_CATEGORY } from '../services/teaser.service';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { CAPTION_GENERATOR_FAQS } from '../utils/page-faqs';
import { ContentService } from '../services/content.service';
import { ContentRequest } from '../models/content.model';
@Component({
    selector: 'app-captiongenerator',
    templateUrl: './captiongenerator.component.html',
    styleUrls: ['./captiongenerator.component.css'],
    standalone: false
})
export class CaptiongeneratorComponent implements OnInit {
  topic = '';
  isLoading = false;
  errorMessage = '';

  captions: string[] = [];
  hashtags: string[] = [];

  constructor(private contentService: ContentService, private teasers: TeaserService) { }

  ngOnInit(): void {
    this.teasers.postsIn(BLOG_CATEGORY.socialMedia)
      .subscribe(items => this.latestPosts = items);

    this.teasers.latestEquipment()
      .subscribe(items => this.latestEquipment = items);
  }
  copy(text: string) {
    navigator.clipboard.writeText(text);
  }
  copyAll() {
    navigator.clipboard.writeText(this.hashtags.join(' '));
  }
  generateContent() {
    if (!this.topic.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    const requestData: ContentRequest = {
        topic: this.topic,
        type: 'captions and hashtags',
      category: 'socialmedia',
      generateArea:"ytseo"
    };

    this.contentService.generateContent(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.captions = response.data?.captions || [];
        this.hashtags = response.data?.hashtags || [];

        console.log('✅ Content generated successfully');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Failed to generate content. Please try again.';
        console.error('❌ Error generating content:', error);
      }
    });
  }

  /** Questions shown in the FAQ block at the foot of the page. */
  pageFaqs = CAPTION_GENERATOR_FAQS;

  /** Blog posts relevant to this page, teased below the content. */
  latestPosts: TeaserItem[] = [];

  /** The newest published equipment guides. */
  latestEquipment: TeaserItem[] = [];
}
