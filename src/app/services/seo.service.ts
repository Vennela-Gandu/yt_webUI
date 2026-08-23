import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title
  ) { }

  /**
   * Sets the page title — the text search results use as the headline and the
   * browser shows in the tab. Angular's Title service is used rather than
   * document.title so the value is present in the server-rendered HTML.
   */
  setTitle(title: string) {
    if (!title) return;
    this.titleService.setTitle(title);
  }

  /**
   * Publishes the description search engines read. Content pages feed this
   * from their short description, so it is written once and serves both the
   * listing card and the meta tag.
   */
  setMetaDescription(description: string) {
    if (!description) return;

    // Strip any markup the editor left in the summary — a meta description is
    // plain text, and tags would show up verbatim in search results.
    const text = description.replace(/<[^>]*>/g, '').trim();
    if (!text) return;

    let tag = this.document.querySelector('meta[name="description"]');

    if (!tag) {
      tag = this.document.createElement('meta');
      tag.setAttribute('name', 'description');
      this.document.head.appendChild(tag);
    }

    tag.setAttribute('content', text);
  }

  /** Both at once — what every page needs on navigation. */
  setPageMeta(title: string, description: string) {
    this.setTitle(title);
    this.setMetaDescription(description);
  }

  setSchema(schema: any) {

    const existing = this.document.getElementById('schema-org');
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-org';
    // Append a real text node child instead of setting `.text` — Angular's SSR DOM
    // doesn't serialize the `.text` property into the rendered HTML, which is why
    // the JSON-LD shows up after hydration but is missing from View Page Source.
    script.appendChild(this.document.createTextNode(JSON.stringify(schema)));

    if (isPlatformServer(this.platformId)) {
      this.document.head.appendChild(script);
    } else {
      // Defer past hydration so we don't fight Angular's DOM reconciliation.
      setTimeout(() => {
        this.document.head.appendChild(script);
      });
    }
  }
}
