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

    // No token (or we are on the server): send them to the login screen. The
    // route is /admin/login — there is no top-level /login, so the old target
    // left an unauthenticated admin looking at a blank page.
    this.router.navigate(['/admin/login']);
    return false;
  }
}
