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
  // Takes a full route path: Equipment lives at the root, not under /learninghub.
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
