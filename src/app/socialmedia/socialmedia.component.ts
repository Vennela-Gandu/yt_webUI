import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-socialmedia',
    templateUrl: './socialmedia.component.html',
    styleUrls: ['./socialmedia.component.css'],
    standalone: false
})
export class SocialmediaComponent {
  constructor(private router: Router) {

  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/socialmedia';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/socialmedia/'+section]);
  }
}
