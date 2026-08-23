import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { toSlug } from '../utils/slug.util';

/** One author, as the API returns them. */
export interface Author {
  authorID: number;
  name: string;
  slug: string;
  role?: string;
  experience?: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
  isActive: boolean;
  postCount?: number;
  equipmentCount?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthorService {
  api = environment.apiBaseUrl.replace(/\/+$/, '') + '/api/author';

  private names$: Observable<Author[]> | null = null;

  // Posts and equipment record the author by name; bylines need to link to
  // their page by slug. Filled in whenever names() resolves.
  private slugByName = new Map<string, string>();

  constructor(private http: HttpClient) { }

  /** Full records — the admin table and the public /author index. */
  list(activeOnly = false) {
    return this.http.get<Author[]>(`${this.api}/list`, { params: { activeOnly } });
  }

  /**
   * Active authors, cached for the session: both editors ask on every open,
   * and every byline needs the name-to-slug mapping. An API failure yields an
   * empty list rather than breaking the page.
   */
  names(): Observable<Author[]> {
    if (!this.names$) {
      this.names$ = this.http.get<Author[]>(`${this.api}/names`).pipe(
        map(rows => rows || []),
        tap(rows => rows.forEach(r => this.slugByName.set(r.name, r.slug))),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.names$;
  }

  /**
   * The URL segment for an author's page. Falls back to slugifying the name,
   * which is what the slug is unless someone customised it in the admin —
   * once names() resolves the exact value is used.
   */
  slugFor(name: string | null | undefined): string {
    if (!name) return '';
    return this.slugByName.get(name) || toSlug(name);
  }

  /** Call after adding/editing an author so the dropdowns pick it up. */
  clearNamesCache() {
    this.names$ = null;
    this.slugByName.clear();
  }

  getById(id: number) {
    return this.http.get<Author>(`${this.api}/${id}`);
  }

  getBySlug(slug: string) {
    return this.http.get<Author>(`${this.api}/slug/${slug}`);
  }

  add(author: Author | any) {
    return this.http.post<any>(`${this.api}/add`, author);
  }

  update(author: Author | any) {
    return this.http.put(`${this.api}/edit`, author);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
