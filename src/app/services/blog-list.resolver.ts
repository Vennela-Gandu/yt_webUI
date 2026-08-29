import { Injectable } from "@angular/core";
import { PostService } from "../post.service";
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Posts for the public /blog page, resolved before the route renders so the
 * server-rendered HTML contains the real list.
 *
 * Uses the PUBLIC list endpoint (published posts only) — not the admin list,
 * which deliberately includes scheduled posts.
 */
@Injectable({ providedIn: 'root' })
export class BlogListResolver {

  /** Matches BlogComponent.pageSize so SSR and the client agree. */
  private readonly pageSize = 10;

  constructor(private service: PostService) { }

  resolve() {
    // categoryId -1 means "every category" to sp_Post_ByCategory.
    return this.service.getPostsByCategory(1, this.pageSize, '', -1).pipe(
      map(res => ({
        posts: res?.posts || [],
        totalCount: res?.totalCount || 0
      })),
      // An API hiccup must leave the page empty, never invent posts: the JSON-LD
      // built from this list would otherwise advertise articles that do not exist.
      catchError(() => of({ posts: [], totalCount: 0 }))
    );
  }
}
