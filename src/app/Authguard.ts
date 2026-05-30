import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(): boolean {
    // localStorage is only available in the browser. Protect access during SSR/prerender.
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('token')) {
      return true;
    }

    // On server or when no token, redirect to login (client-side will handle navigation).
    this.router.navigate(['/login']);
    return false;
  }
}
