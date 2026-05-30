import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent {
  constructor(private router: Router) { }

  navigate(path: string) {
    this.router.navigate([path]);
  }
  open: string | null = null;

  openMenu(name: string): void {
    this.open = name;
  }

  closeMenu(name: string): void {
    if (this.open === name) {
      this.open = null;
    }
  }
  menuOpen = false;
  submenuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
}
