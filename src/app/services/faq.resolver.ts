import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PostService } from "../post.service";
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { toSlug } from "../utils/slug.util";

/**
 * FAQs for the /learninghub/faqs page and its per-category URLs, resolved
 * before the route renders so the server-rendered HTML carries the real
 * questions and the FAQ JSON-LD AppComponent builds from them.
 *
 * On a category URL only that category's questions are fetched — the markup
 * must describe the page a visitor actually sees, not the full list.
 */
@Injectable({ providedIn: 'root' })
export class FaqResolver {

  /**
   * Matches FaqsComponent.pageSize.
   *
   * This used to request every FAQ (pageSize 0) — 465 rows and 302 KB —
   * to render a page showing 30, which the server had to wait for before
   * it could respond at all. It also meant the FAQ structured data
   * advertised hundreds of questions that were not on the page.
   */
  private readonly pageSize = 30;

  constructor(private service: PostService) { }

  resolve(route: ActivatedRouteSnapshot) {
    const slug = route.params['slug'];

    // categoryId -1 means "any" to sp_Post_ByCategory.
    const categoryId$ = slug
      ? this.service.getCategories('faq').pipe(
          map(categories => {
            const match = (categories || []).find(c => toSlug(c.name) === slug);
            return match ? match.categoryID : -1;
          })
        )
      : of(-1);

    return categoryId$.pipe(
      switchMap(categoryId =>
        this.service.getAllFAQs(1, this.pageSize, "", categoryId)),
      map(res => ({
        faqs: res?.faqs || [],
        totalCount: res?.totalCount || 0
      })),
      // An API failure leaves the page empty rather than publishing invented
      // questions and answers into the FAQ structured data.
      catchError(() => of({ faqs: [], totalCount: 0 }))
    );
  }
}
