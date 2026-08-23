import { Component } from '@angular/core';
import { SOCIAL_LINKS } from '../utils/social-links';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent {
  // Shared with the header and the Organization JSON-LD.
  socialLinks = SOCIAL_LINKS;
}
