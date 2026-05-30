import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ContentResponse } from './models/content.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from './services/seo.service';
import { filter } from 'rxjs';

const SITE_URL = 'https://www.ytcreator.in/';
const SITE_NAME = 'YT Creator';
const SITE_DESCRIPTION = 'AI-powered YouTube creator toolkit: SEO, content ideas, captions, analytics.';
const LOGO_URL = 'https://www.ytcreator.in/assets/Yt%20Creator%20Icon.png';

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
    // Handle initial route immediately (necessary for SSR to inject schema into server-rendered HTML)
    this.handleRoute(this.route.root);

    // Also update schema on client-side navigation
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.handleRoute(this.route.root);
      });

    // Inject GTM/GA only on the browser to avoid SSR "window is not defined" issues
    if (isPlatformBrowser(this.platformId)) {
      this.injectGTM();
      this.injectGA();
    }
  }

  private injectGTM() {
    // avoid duplicate insertion
    if (this.document.getElementById('gtm-script')) return;

    const dataLayerName = 'dataLayer';
    (window as any)[dataLayerName] = (window as any)[dataLayerName] || [];
    (window as any)[dataLayerName].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const script = this.document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TBHBSX7F';
    this.document.head.appendChild(script);
  }

  private injectGA() {
    if (this.document.getElementById('ga-script')) return;

    const script = this.document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-TECC7B1N4L';
    this.document.head.appendChild(script);

    const inline = this.document.createElement('script');
    inline.id = 'ga-inline';
    inline.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TECC7B1N4L');
    `;
    this.document.head.appendChild(inline);
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
        // TODO: add the brand's social profile URLs (YouTube, Instagram, LinkedIn, X) so search engines can disambiguate the entity.
        "sameAs": [],
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
      "dateModified": post.publishedDate,
      "author": {
        "@type": "Person",
        "name": SITE_NAME
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
