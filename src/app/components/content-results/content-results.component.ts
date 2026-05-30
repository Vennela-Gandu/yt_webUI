import { Component, Input } from '@angular/core';
import { ContentResponse } from '../../models/content.model';

@Component({
    selector: 'app-content-results',
    templateUrl: './content-results.component.html',
    styleUrls: ['./content-results.component.css'],
    standalone: false
})
export class ContentResultsComponent {
  @Input() content: ContentResponse | null = null;

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  copyAllHashtags() {
    if (this.content) {
      this.copyToClipboard(this.content.hashtags.join(' '));
    }
  }
  copyAllFaqs() {
    if (this.content) {
      this.copyToClipboard(this.content.faqs.join(' '));
    }
  }
  copyAllKeywords() {
    if (this.content) {
      this.copyToClipboard(this.content.keywords.join(', '));
    }
  }
}
