import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-contentideas',
    templateUrl: './contentideas.component.html',
    styleUrls: ['./contentideas.component.css'],
    standalone: false
})
export class ContentideasComponent {
  constructor(private router: Router) {
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/contentideas';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/contentideas/' + section]);
  }
}
