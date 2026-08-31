import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ExploreLink {
  label: string;
  path: string;
}

/** The places every content page points to on its way out. */
const EXPLORE_LINKS: ExploreLink[] = [
  { label: 'YouTube SEO', path: '/youtubeseo' },
  { label: 'Caption Generator', path: '/socialmedia/captiongenerator' },
  { label: 'Blog', path: '/blog' },
  { label: 'Creator Equipment', path: '/equipment' },
  { label: 'FAQ', path: '/learninghub/faqs' }
];

/**
 * The row of destinations that closes every content page, just above the
 * footer.
 *
 * The link to the page you are already on is dropped, so the row is derived
 * from the current route rather than configured separately on each page — one
 * page cannot drift out of step with the others.
 */
@Component({
  selector: 'app-explore-links',
  templateUrl: './explore-links.component.html',
  styleUrls: ['./explore-links.component.css'],
  standalone: false
})
export class ExploreLinksComponent {

  constructor(private router: Router) { }

  get links(): ExploreLink[] {
    // Query strings and fragments select a view of a page, not another page.
    const url = this.router.url.split('?')[0].split('#')[0];
    return EXPLORE_LINKS.filter(link => link.path !== url);
  }
}
