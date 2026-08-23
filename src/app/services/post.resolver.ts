import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { PostService } from "../post.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SeoService } from '../services/seo.service';

@Injectable({ providedIn: 'root' })
export class PostResolver {

  constructor(private service: PostService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService) { }

  resolve(route: ActivatedRouteSnapshot) {
    const id = Number(route.paramMap.get('id'));
    return this.service.getPostById(id).pipe(
      tap(post => {
        // During SSR set the Article JSON-LD so prerendered HTML contains it
        if (isPlatformServer(this.platformId) && post) {
          try {
            const articleSchema = {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.shortDescription,
              "datePublished": post.publishedDate,
              "dateModified": post.updatedDate || post.publishedDate,
              "author": { "@type": "Person", "name": post.authorName || "YT Creator" },
              "publisher": { "@type": "Organization", "name": "YT Creator", "logo": { "@type": "ImageObject", "url": "https://www.ytcreator.in/assets/logo.png" } },
              "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.ytcreator.in/blog/${post.postID}` }
            };
            this.seo.setSchema([articleSchema]);
            // Title and description here too, so they land in the
            // server-rendered HTML rather than only after hydration.
            this.seo.setPageMeta(
              `${post.title} | YT Creator`,
              post.shortDescription
            );
          } catch (e) {
            // ignore
          }
        }
      }),
      catchError(() => {
        // If API call fails on server, provide a small stub post so SSR still renders content & schema
        if (isPlatformServer(this.platformId)) {
          const samplePost: any = {
            postID: id,
            title: 'YT Creator sample article',
            shortDescription: 'Sample description for prerender',
            description: '<p>This is a sample article used during server-side prerendering.</p>',
            prerenderStub: true,
            publishedDate: new Date().toISOString()
          };

          try {
            const articleSchema = {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": samplePost.title,
              "description": samplePost.shortDescription,
              "datePublished": samplePost.publishedDate,
              "dateModified": samplePost.publishedDate,
              "author": { "@type": "Person", "name": "YT Creator" },
              "publisher": { "@type": "Organization", "name": "YT Creator", "logo": { "@type": "ImageObject", "url": "https://www.ytcreator.in/assets/logo.png" } },
              "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.ytcreator.in/blog/${samplePost.postID}` }
            };
            this.seo.setSchema([articleSchema]);
          } catch (e) { }

          return of(samplePost);
        }
        return of(null);
      })
    );
  }
}
