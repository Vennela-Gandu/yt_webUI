import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { PostService } from "../post.service";
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SeoService } from '../services/seo.service';

@Injectable({ providedIn: 'root' })
export class FaqResolver {
faqslist:any=[]
  constructor(private service: PostService, @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService) { }

  resolve() {
    // During server-side rendering, backend APIs may not be reachable.
    // Return a small static stub so prerender can generate FAQ schema into the HTML.
    if (isPlatformServer(this.platformId)) {
      // const sampleFaqs = [
      //   { question: 'How do I get started with YouTube SEO?', answer: 'Start by researching keywords relevant to your niche, optimize your video titles, descriptions, and tags, create engaging thumbnails, and focus on viewer retention through quality content.' },
      //   { question: 'What is the best time to post on social media?', answer: 'The best posting times vary by platform and audience. Generally, weekdays between 9 AM - 3 PM work well.' }
      // ];
 this.service.getAllFAQs(1, 0, "", -1).subscribe(res => {
      this.faqslist = res.faqs;
      // Also set the FAQ JSON-LD during SSR so prerendered HTML contains it
      // try {
      //   const faqSchema = {
      //     "@context": "https://schema.org",
      //     "@type": "FAQPage",
      //     "mainEntity": this.faqslist.map((f: any) => ({
      //       "@type": "Question",
      //       "name": f.question,
      //       "acceptedAnswer": {
      //         "@type": "Answer",
      //         "text": f.answer
      //       }
      //     }))
      //   };
      //   this.seo.setSchema([faqSchema]);
      // } catch (e) {
      //   // ignore if seo service fails on server
      // }

      return of({ faqs: this.faqslist, totalCount: this.faqslist.length });
    })
    }

    // On browser, call the real API but gracefully handle errors.
    return this.service.getAllFAQs(1, 0, "", -1).pipe(
      catchError(() => of({ faqs: [], totalCount: 0 }))
    );
  }
}
