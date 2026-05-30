import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-learninghub',
    templateUrl: './learninghub.component.html',
    styleUrls: ['./learninghub.component.css'],
    standalone: false
})
export class LearninghubComponent {
  constructor(private router: Router) {
  }
  get isChildRouteActive(): boolean {
    return this.router.url !== '/learninghub';
  }
  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate(['/learninghub/' + section]);
  }
}
