import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export type ReactionType = 'like' | 'dislike';

export interface ReactionCounts {
  likes: number;
  dislikes: number;
}

/** The kinds of article a visitor can react to. */
export type ReactionSubject = 'post' | 'equipment';

/**
 * Likes and dislikes on an article.
 *
 * Shared by the blog post and equipment guide pages so the rule lives once:
 * the like count is public, the dislike count is the admin's, and a visitor's
 * own choice is remembered so they cannot vote twice.
 *
 * NOTE: the API does not implement these yet — the endpoints answer 404. The
 * pages treat a failure as "no counts to add", so the buttons work and the
 * tallies simply appear once the backend lands. Expected contract:
 *   GET  /api/{post|equipment}/{id}/reactions  ->  { likes, dislikes }
 *   POST /api/{post|equipment}/{id}/reaction   ->  body { type: 'like'|'dislike' }
 */
@Injectable({ providedIn: 'root' })
export class ReactionsService {

  private readonly api = environment.apiBaseUrl.replace(/\/+$/, '') + '/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  counts(subject: ReactionSubject, id: number) {
    return this.http.get<ReactionCounts>(`${this.api}/${subject}/${id}/reactions`);
  }

  submit(subject: ReactionSubject, id: number, type: ReactionType) {
    return this.http.post(`${this.api}/${subject}/${id}/reaction`, { type });
  }

  /**
   * Moves the tallies from a previous choice to a new one.
   *
   * Pure, so the page can show the change immediately without waiting for the
   * request to come back.
   */
  applyChange(counts: ReactionCounts, from: ReactionType | null, to: ReactionType | null): ReactionCounts {
    const next = { ...counts };

    if (from === 'like') next.likes = Math.max(0, next.likes - 1);
    if (from === 'dislike') next.dislikes = Math.max(0, next.dislikes - 1);
    if (to === 'like') next.likes++;
    if (to === 'dislike') next.dislikes++;

    return next;
  }

  /** Dislike counts are for the admin only; likes are public. */
  isAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return !!localStorage.getItem('token');
    } catch {
      return false;
    }
  }

  /** This viewer's own choice, or null if they have not voted. */
  remembered(subject: ReactionSubject, id: number): ReactionType | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const value = localStorage.getItem(this.key(subject, id));
      return value === 'like' || value === 'dislike' ? value : null;
    } catch {
      // Private browsing and blocked site data both throw here.
      return null;
    }
  }

  remember(subject: ReactionSubject, id: number, value: ReactionType | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (value) localStorage.setItem(this.key(subject, id), value);
      else localStorage.removeItem(this.key(subject, id));
    } catch {
      // Not being able to remember the vote is not worth breaking the page.
    }
  }

  private key(subject: ReactionSubject, id: number): string {
    return `${subject}-reaction-${id}`;
  }
}
