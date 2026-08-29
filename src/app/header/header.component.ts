import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SOCIAL_LINKS } from '../utils/social-links';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Shared with the footer and the Organization JSON-LD.
  socialLinks = SOCIAL_LINKS;

  open: string | null = null;
  menuOpen = false;
  submenuOpen = false;

  private routerSub?: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // On mobile the nav panel is absolutely positioned over the page. Nothing
    // used to close it, so after tapping a link the reader landed on the new
    // page with the menu still covering it. Close it whenever a navigation
    // finishes — that also covers the browser back/forward buttons.
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  /** Desktop hover dropdowns. */
  openMenu(name: string): void {
    this.open = name;
  }

  closeMenu(name: string): void {
    if (this.open === name) {
      this.open = null;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }

  /**
   * Tapping a link inside the panel closes it straight away, rather than
   * waiting for the navigation to complete. This also handles tapping a link
   * for the page you are already on, where no NavigationEnd is emitted and the
   * menu would otherwise stay open for good.
   */
  onNavClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a')) {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu(): void {
    this.menuOpen = false;
    this.submenuOpen = false;
    this.open = null;
  }
}
