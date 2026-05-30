import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // setSchema(schema: any) {

  //   // remove old schema
  //   const existing = this.document.getElementById('schema-org');
  //   if (existing) existing.remove();

  //   const script = this.document.createElement('script');
  //   script.type = 'application/ld+json';
  //   script.id = 'schema-org';
  //   script.text = JSON.stringify(schema);

  //   this.document.head.appendChild(script);
  // }



  setSchema(schema: any) {

    const existing = this.document.getElementById('schema-org');
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-org';
    // Append a real text node child instead of setting `.text` — Angular's SSR DOM
    // doesn't serialize the `.text` property into the rendered HTML, which is why
    // the JSON-LD shows up after hydration but is missing from View Page Source.
    script.appendChild(this.document.createTextNode(JSON.stringify(schema)));

    if (isPlatformServer(this.platformId)) {
      this.document.head.appendChild(script);
    } else {
      // Defer past hydration so we don't fight Angular's DOM reconciliation.
      setTimeout(() => {
        this.document.head.appendChild(script);
      });
    }
  }
}

