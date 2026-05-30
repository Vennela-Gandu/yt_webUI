import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent {
  [x: string]: any;
  loginData = {
    email: '',
    password: ''
  };
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  onLogin() {
    if (this.loginData.email && this.loginData.password) {
      this.authService.login({ email: this.loginData.email, password: this.loginData.password, role: 'admin' }).subscribe({
        next: res => {
           localStorage.setItem('token', res.token);
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => alert('Login failed')
      });
    }

    console.log('Login Request:', this.loginData);

    // Call ASP.NET Core API here
    // this.authService.login(this.loginData).subscribe(...)
  }
}
