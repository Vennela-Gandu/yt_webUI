import { Component, Input } from '@angular/core';

/**
 * A loading state that sits in the page, where the content will appear.
 *
 * Distinct from the global <app-loader> overlay: this replaces the article or
 * list that has not arrived yet, so a page never shows "not found" while it is
 * still fetching. An empty or missing-record message is only honest once the
 * request has actually finished.
 */
@Component({
  selector: 'app-inline-loader',
  templateUrl: './inline-loader.component.html',
  styleUrls: ['./inline-loader.component.css'],
  standalone: false
})
export class InlineLoaderComponent {
  @Input() text = 'Loading…';
}
