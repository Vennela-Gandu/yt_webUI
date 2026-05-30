import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // USE YOUR EXISTING SERVICE

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  go(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    // Reuse existing logout logic
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
