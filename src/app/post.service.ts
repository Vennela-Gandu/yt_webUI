import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  api = environment.apiBaseUrl.replace(/\/+$/, '') + '/api';

  constructor(private http: HttpClient) { }

  /**
   * Category list, cached for the session.
   *
   * The blog list, every category page, each article and the FAQ pages all
   * show the same sidebar, so this was re-requested on every navigation.
   * shareReplay keeps the first response and hands it to later callers.
   */
  private categoryCache = new Map<string, Observable<any[]>>();

  getCategories(type: any) {
    const key = String(type);

    if (!this.categoryCache.has(key)) {
      this.categoryCache.set(key,
        this.http.get<any[]>(`${this.api}/post/getAllCategories?type=` + key).pipe(
          shareReplay({ bufferSize: 1, refCount: false })
        ));
    }

    return this.categoryCache.get(key)!;
  }

  addPost(data: any) {
    return this.http.post(`${this.api}/post/add`, data);
  }

  updatePost(data: any) {
    return this.http.put(`${this.api}/post/edit`, data);
  }

  getPostsByCategory(page: number,
    pageSize: number,
    search: string,
    categoryId?: number,
    author?: string) {
    let params: any = {
      page,
      pageSize
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (author) params.author = author;
    return this.http.get<any>(`${this.api}/post/category/`, {params});
  }
  getPostById(id: number) {
    return this.http.get<any>(`${this.api}/post/${id}`);
  }

  getTrendingPosts(page: number, pageSize: number, search: string) {
    let params: any = {
      page,
      pageSize
    };
    if (search) params.search = search;
    return this.http.get<any>(`${this.api}/post/trending`, { params });
  }

  recordView(id: number) {
    return this.http.post(`${this.api}/post/${id}/view`, {});
  }

  getAllFAQs(page: number,
    pageSize: number,
    search: string,
    categoryId?: number) {
    let params: any = {
      page,
      pageSize
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    return this.http.get<any>(`${this.api}/post/getAllFAQs`, { params });
  }

  getFAQById(id: number) {
    return this.http.get<any>(`${this.api}/post/getFAQById/${id}`);
  }

  addFAQ(faq: any) {
    return this.http.post(`${this.api}/post/addFAQ`, faq);
  }

  /**
   * Removes a FAQ.
   *
   * NOTE: the API has no delete route for FAQs yet — it answers 404. The list
   * surfaces the failure rather than pretending the row is gone. Expected:
   *   DELETE /api/post/deleteFAQ/{id}
   */
  deleteFAQ(id: number) {
    return this.http.delete(`${this.api}/post/deleteFAQ/${id}`);
  }

  updateFAQ(id: number, faq: any) {
    return this.http.put(`${this.api}/post/updateFAQ/${id}`, faq);
  }
  /**
   * Like / dislike counts for a post.
   *
   * NOTE: the API does not implement these yet — both endpoints answer 404 at
   * the time of writing. The component treats a failure as "reactions
   * unavailable" and hides the counts, so the page stays correct until the
   * backend lands. Expected contract:
   *   GET  /api/post/{id}/reactions  ->  { likes: number, dislikes: number }
   *   POST /api/post/{id}/reaction   ->  body { type: 'like' | 'dislike' }
   */
  getReactions(postId: number) {
    return this.http.get<{ likes: number; dislikes: number }>(
      `${this.api}/post/${postId}/reactions`
    );
  }

  react(postId: number, type: 'like' | 'dislike') {
    return this.http.post(`${this.api}/post/${postId}/reaction`, { type });
  }

  getRelatedPosts(postId: number) {
    return this.http.get<any[]>(
      `${this.api}/post/related/${postId}`
    );
  }
}
