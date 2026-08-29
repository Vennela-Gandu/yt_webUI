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
              post.shortDescription,
              post.title
            );
          } catch (e) {
            // ignore
          }
        }
      }),
      // If the post cannot be loaded, the page renders nothing. It must never
      // fall back to placeholder text: the Article JSON-LD published alongside
      // it would tell search engines that a real URL holds an article which
      // does not exist.
      catchError(() => of(null))
    );
  }
}
