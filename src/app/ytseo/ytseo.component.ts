import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ContentResponse } from '../models/content.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-ytseo',
    templateUrl: './ytseo.component.html',
    styleUrls: ['./ytseo.component.css'],
    standalone: false
})
export class YtseoComponent {
  title = 'YouTube Content Generator';
  generatedContent: ContentResponse | null = null;
 constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  onContentGenerated(content: ContentResponse) {
    this.generatedContent = content;
    if(isPlatformBrowser(this.platformId)){
   setTimeout(() => {
       window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
    }
  
 
  }
}
