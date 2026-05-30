import { Component } from '@angular/core';
import { ContentService } from '../services/content.service';
import { ContentRequest } from '../models/content.model';
interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}
@Component({
    selector: 'app-captiongenerator',
    templateUrl: './captiongenerator.component.html',
    styleUrls: ['./captiongenerator.component.css'],
    standalone: false
})
export class CaptiongeneratorComponent {
  topic = '';
  isLoading = false;
  errorMessage = '';

  captions: string[] = [];
  hashtags: string[] = [];

  constructor(private contentService: ContentService) { }
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

  faqs: FAQ[] = [
    {
      question: 'What is the best time to post on social media?',
      answer: 'The best posting times vary by platform and audience. Generally, weekdays between 9 AM - 3 PM work well. Analyze your audience insights to find your optimal posting schedule.',
      isOpen: false
    },
    {
      question: 'Do I need special equipment to start creating content?',
      answer: 'Not necessarily. You can start with a smartphone and basic editing software. As you grow, invest in better equipment like cameras, microphones, and lighting based on your needs.',
      isOpen: false
    },
  ];
  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
}
