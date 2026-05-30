import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { BlogService } from "./blog.service";
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SeoService } from './seo.service';

@Injectable({ providedIn: 'root' })
export class BlogListResolver {

  constructor(private service: BlogService, @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService) { }

  resolve() {
   if (isPlatformServer(this.platformId)) {
      // Small sample so SSR has items to include in JSON-LD
      const sampleBlogs = [
        { postID: 1, title: 'Getting started with YouTube SEO', shortDescription: 'A quick starter guide for optimizing your videos.', publishedDate: new Date().toISOString(), category: 'SEO' },
        { postID: 2, title: 'How to write better thumbnails', shortDescription: 'Design tips to improve CTR for your videos.', publishedDate: new Date().toISOString(), category: 'Thumbnails' }
      ];

      try {
        const blogSchema = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "YouTube Creator Blog",
          "url": "https://www.ytcreator.in/blog",
          "description": "Latest YouTube tips, SEO strategies and content ideas",
          "blogPost": sampleBlogs.map(post => ({
            "@type": "Article",
            "headline": post.title,
            "description": post.shortDescription,
            "datePublished": post.publishedDate,
            "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.ytcreator.in/blog/${post.postID}` }
          }))
        };
        this.seo.setSchema([blogSchema]);
      } catch (e) {
        // ignore errors during SSR
      }

      return of({ blogs: sampleBlogs, totalCount: sampleBlogs.length });
    }

    return this.service.getBlogs().pipe(
      catchError(() => of([]))
    );
  }
}
