import { Component, Input } from '@angular/core';

/** One question and its answer. Expansion state is added by this component. */
export interface FaqEntry {
  question: string;
  answer: string;
}

interface OpenableFaq extends FaqEntry {
  isOpen: boolean;
}

/**
 * The expand/collapse FAQ block used at the foot of the content pages.
 *
 * Presentational: the page supplies the questions, this owns only which one is
 * open. Keeps the markup and the "View All FAQs" link in one place rather than
 * repeated on every page that ends with a FAQ.
 */
@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css'],
  standalone: false
})
export class FaqAccordionComponent {

  @Input() heading = 'Frequently Asked Questions';
  @Input() intro = '';
  @Input() moreLink = '/learninghub/faqs';
  @Input() moreLabel = 'View All FAQs';

  /** Copying keeps the caller's list free of this component's open/closed flag. */
  @Input() set faqs(value: FaqEntry[]) {
    this.items = (value || []).map(faq => ({ ...faq, isOpen: false }));
  }

  items: OpenableFaq[] = [];

  toggle(faq: OpenableFaq): void {
    faq.isOpen = !faq.isOpen;
  }
}
