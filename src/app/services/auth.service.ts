import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  api = environment.apiBaseUrl+'/api';
  constructor(private http: HttpClient, private router: Router) { }
  isAuthenticated(): boolean {
     return !!localStorage.getItem('token');
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/user/login`, data);
  }
  register(data: any) {
    return this.http.post(`${this.api}/user/createadmin`, data);
  }
  logout() {
     localStorage.removeItem('token');
  }
}
