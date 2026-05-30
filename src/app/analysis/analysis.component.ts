import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.css'],
    standalone: false
})
export class AnalysisComponent {
  constructor(private router: Router) {
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/analysis';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/analysis/' + section]);
  }
}
