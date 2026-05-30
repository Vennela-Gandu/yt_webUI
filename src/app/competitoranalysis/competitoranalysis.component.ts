import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-competitoranalysis',
    templateUrl: './competitoranalysis.component.html',
    styleUrls: ['./competitoranalysis.component.css'],
    standalone: false
})
export class CompetitoranalysisComponent {
  constructor(private router: Router) {
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/competitoranalysis';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/competitoranalysis/' + section]);
  }
}
