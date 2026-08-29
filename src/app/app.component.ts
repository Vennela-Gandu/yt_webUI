import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ContentResponse } from './models/content.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from './services/seo.service';
import { filter } from 'rxjs';
import { SOCIAL_PROFILE_URLS } from './utils/social-links';
import { DEFAULT_PAGE_META, pageMetaFor } from './utils/page-meta';

const SITE_URL = 'https://www.ytcreator.in/';
const SITE_NAME = 'YT Creator';
const SITE_DESCRIPTION = 'AI-powered YouTube creator toolkit: SEO, content ideas, captions, analytics.';
const LOGO_URL = 'https://www.ytcreator.in/assets/Yt%20Creator%20Icon.webp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})

export class AppComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    // Handle initial route immediately (necessary for SSR to inject the title,
    // description and schema into the server-rendered HTML)
    this.applyPageMeta();
    this.handleRoute(this.route.root);

    // Also update them on client-side navigation
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.applyPageMeta();
        this.handleRoute(this.route.root);
      });

    // Browser only — GTM touches `window`, which does not exist during SSR.
    if (isPlatformBrowser(this.platformId)) {
      this.injectGTM();
    }
  }

  /**
   * Loads the GTM container, which is the single place tags are configured.
   *
   * GA4 is NOT loaded here as well: the container already carries the Google
   * tag for G-TECC7B1N4L, so injecting gtag.js directly fetched a second copy
   * of the same 161 KiB script and configured the property twice — duplicating
   * page views as well as the download.
   *
   * The container is fetched once the browser is idle. It is ~370 KB and
   * nothing on screen depends on it, so it has no business competing with the
   * page's own resources for bandwidth during first paint.
   */
  private injectGTM() {
    if (this.document.getElementById('gtm-script')) return;

    const dataLayerName = 'dataLayer';
    (window as any)[dataLayerName] = (window as any)[dataLayerName] || [];
    (window as any)[dataLayerName].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const load = () => {
      if (this.document.getElementById('gtm-script')) return;
      const script = this.document.createElement('script');
      script.id = 'gtm-script';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TBHBSX7F';
      this.document.head.appendChild(script);
    };

    const idle = (window as any).requestIdleCallback;
    if (typeof idle === 'function') {
      // Cap the wait so the container still loads on a busy page.
      idle(load, { timeout: 4000 });
    } else {
      // Safari and older browsers: wait for load, then yield a tick.
      window.addEventListener('load', () => setTimeout(load, 1200), { once: true });
    }
  }

  /**
   * Applies the page title and meta description for the route just navigated
   * to, then its JSON-LD. Pages built from a record (a post, an equipment
   * guide, an author) are not in the table and overwrite these with their own
   * once the record loads.
   */
  private applyPageMeta() {
    const meta = pageMetaFor(this.router.url) || DEFAULT_PAGE_META;
    this.seo.setPageMeta(meta.title, meta.description);
  }

  handleRoute(current: ActivatedRoute) {

    if (current.firstChild) {
      this.handleRoute(current.firstChild);
      return;
    }

    const type = current.snapshot.data['schema'];
    let pageEntities: any[] = [];

    switch (type) {
      case 'home':
        break;

      case 'bloglist':
        pageEntities = this.blogListSchema();
        break;

      case 'post':
        pageEntities = this.postSchema(current.snapshot.data['post']);
        break;

      case 'faq':
        // Resolver can return different shapes depending on implementation.
        const rawFaqs = current.snapshot.data['faqs'];
        let faqsArray: any[] = [];
        if (Array.isArray(rawFaqs)) {
          faqsArray = rawFaqs;
        } else if (rawFaqs && Array.isArray(rawFaqs.faqs)) {
          faqsArray = rawFaqs.faqs;
        } else if (rawFaqs && Array.isArray(rawFaqs.items)) {
          faqsArray = rawFaqs.items;
        }

        pageEntities = this.faqSchema(faqsArray);
        break;
    }

    this.seo.setSchema([...this.siteBaseSchema(), ...pageEntities]);
  }

  siteBaseSchema(): any[] {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": LOGO_URL
        },
        // The brand's own profiles. Search engines use sameAs to tie these
        // accounts to this site as one entity — the same list the header and
        // footer icons link to.
        "sameAs": SOCIAL_PROFILE_URLS,
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "url": `${SITE_URL}contactus`
          // TODO: add telephone or email here — Google's Organization rich result requires one of them.
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": SITE_DESCRIPTION,
        "inLanguage": "en",
        "publisher": { "@id": `${SITE_URL}#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_URL}blog?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ];
  }

  blogListSchema(): any[] {
    return [{
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "YouTube Creator Blog",
      "url": `${SITE_URL}blog`,
      "description": "Latest YouTube tips, SEO strategies and content ideas",
      "publisher": { "@id": `${SITE_URL}#organization` }
    }];
  }

  postSchema(post: any): any[] {
    if (!post) return [];

    return [{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.shortDescription,
      "datePublished": post.publishedDate,
      // Reflect a later edit so search results can show the post as updated.
      "dateModified": post.updatedDate || post.publishedDate,
      "author": {
        "@type": "Person",
        "name": post.authorName || SITE_NAME
      },
      "publisher": { "@id": `${SITE_URL}#organization` },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}blog/${post.postID}`
      }
    }];
  }

  faqSchema(faqs: any[]): any[] {
    if (!faqs || faqs.length === 0) return [];

    return [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    }];
  }

}
