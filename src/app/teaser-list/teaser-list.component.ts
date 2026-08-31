import { Component, Input } from '@angular/core';

/** One row in a teaser list: a title and the route it opens. */
export interface TeaserItem {
  title: string;
  /** Router link commands, e.g. ['/blog', slug, id]. */
  link: any[];
}

/**
 * A short list of titles linking somewhere else on the site, closed by a
 * "Check More" button — the recent blogs and latest gear teasers.
 *
 * Presentational only: the page that uses it owns the fetching, so the same
 * layout serves posts, equipment, or anything else with a title and a route.
 * Renders nothing at all when the list is empty, which is what keeps a failed
 * API call from leaving an empty shelf on the page.
 */
@Component({
  selector: 'app-teaser-list',
  templateUrl: './teaser-list.component.html',
  styleUrls: ['./teaser-list.component.css'],
  standalone: false
})
export class TeaserListComponent {

  @Input() heading = '';
  @Input() subtitle = '';
  @Input() items: TeaserItem[] = [];

  /** Where "Check More" goes. */
  @Input() moreLink = '';
  @Input() moreLabel = 'Check More';
}
