import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PostService } from "../post.service";
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { toSlug } from "../utils/slug.util";

/**
 * Posts for the /blog page and its per-category URLs, resolved before the route
 * renders so the server-rendered HTML contains the real list.
 *
 * Category-aware: it previously ignored the slug and always resolved every
 * category, so a category page server-rendered the full list and then replaced
 * it client-side once the filtered set arrived — a flash of the wrong articles
 * and a layout shift on every visit.
 *
 * Uses the PUBLIC list endpoint (published posts only) — not the admin list,
 * which deliberately includes scheduled posts.
 */
@Injectable({ providedIn: 'root' })
export class BlogListResolver {

  /** Matches BlogComponent.pageSize so SSR and the client agree. */
  private readonly pageSize = 10;

  constructor(private service: PostService) { }

  resolve(route: ActivatedRouteSnapshot) {
    const slug = route.params['slug'];

    // "Trending" is a virtual category: posts ordered by how often they were
    // opened, which is a different endpoint rather than a category id.
    if (slug === 'trending') {
      return this.service.getTrendingPosts(1, this.pageSize, '').pipe(
        map(res => this.shape(res)),
        catchError(() => of(this.empty()))
      );
    }

    if (!slug) {
      // categoryId -1 means "every category" to sp_Post_ByCategory.
      return this.service.getPostsByCategory(1, this.pageSize, '', -1).pipe(
        map(res => this.shape(res)),
        catchError(() => of(this.empty()))
      );
    }

    return this.service.getCategories('blog').pipe(
      map(categories => {
        const match = (categories || []).find(c => toSlug(c.name) === slug);
        return match ? match.categoryID : -1;
      }),
      switchMap(categoryId =>
        this.service.getPostsByCategory(1, this.pageSize, '', categoryId)),
      map(res => this.shape(res)),
      // An API hiccup must leave the page empty, never invent posts: the JSON-LD
      // built from this list would otherwise advertise articles that do not exist.
      catchError(() => of(this.empty()))
    );
  }

  private shape(res: any) {
    return {
      posts: res?.posts || [],
      totalCount: res?.totalCount || 0
    };
  }

  private empty() {
    return { posts: [], totalCount: 0 };
  }
}
