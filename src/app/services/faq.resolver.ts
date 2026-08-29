import { Injectable } from "@angular/core";
import { PostService } from "../post.service";
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * FAQs for the /learninghub/faqs page, resolved before the route renders so
 * the server-rendered HTML carries the real questions and the FAQ JSON-LD
 * AppComponent builds from them.
 */
@Injectable({ providedIn: 'root' })
export class FaqResolver {

  constructor(private service: PostService) { }

  resolve() {
    // pageSize 0 means "all" to sp_Post_ByCategory; categoryId -1 means "any".
    return this.service.getAllFAQs(1, 0, "", -1).pipe(
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
