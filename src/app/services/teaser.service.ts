import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PostService } from '../post.service';
import { EquipmentService } from './equipment.service';
import { TeaserItem } from '../teaser-list/teaser-list.component';
import { toSlug } from '../utils/slug.util';

/**
 * The lists behind the "recent blogs" and "latest gear" teasers.
 *
 * Every content page ends with the same two sections, so the fetching, the
 * route building and the failure handling live here once rather than being
 * copied into each component.
 *
 * A failed request resolves to an empty list, never an error: the teaser hides
 * itself when it has nothing to show, so an API outage quietly removes the
 * section instead of breaking the page around it.
 */
@Injectable({ providedIn: 'root' })
export class TeaserService {

  /** How many rows a teaser shows. */
  private readonly defaultCount = 5;

  constructor(
    private posts: PostService,
    private equipment: EquipmentService) { }

  /**
   * The newest published posts in one blog category, as teaser rows.
   * Pass -1 for every category.
   */
  postsIn(categoryId: number, count = this.defaultCount): Observable<TeaserItem[]> {
    return this.posts.getPostsByCategory(1, count, '', categoryId).pipe(
      map(res => (res?.posts || []).map((p: any) => ({
        title: p.title,
        // The list endpoint returns no slug; the blog page derives it from the
        // title the same way, and the post route is keyed on it.
        link: ['/blog', toSlug(p.title), p.postID]
      }))),
      catchError(() => of([]))
    );
  }

  /** The newest published equipment guides, as teaser rows. */
  latestEquipment(count = this.defaultCount): Observable<TeaserItem[]> {
    // publishedOnly, so a scheduled guide never surfaces on a public page.
    return this.equipment.getList(1, count, '', null, true).pipe(
      map(res => (res?.equipments || []).map((e: any) => ({
        title: e.title,
        link: ['/equipment-detail', toSlug(e.title)]
      }))),
      catchError(() => of([]))
    );
  }
}

/** Blog category ids, so pages name the category instead of a bare number. */
export const BLOG_CATEGORY = {
  all: -1,
  youtube: 16,
  youtubeSeo: 17,
  socialMedia: 11,
  contentIdeas: 2,
  learningHub: 7
};
