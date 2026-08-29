import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

import { HeaderComponent } from './header.component';

/**
 * The mobile nav panel is absolutely positioned over the page, so leaving it
 * open after a tap hid the page the reader had just asked for.
 */
describe('HeaderComponent mobile menu', () => {
  let events: Subject<any>;
  let component: HeaderComponent;

  beforeEach(() => {
    events = new Subject<any>();

    TestBed.configureTestingModule({
      providers: [
        HeaderComponent,
        { provide: Router, useValue: { events: events.asObservable(), navigate: () => {} } }
      ]
    });

    component = TestBed.inject(HeaderComponent);
    component.ngOnInit();
  });

  it('starts closed', () => {
    expect(component.menuOpen).toBe(false);
  });

  it('opens when the hamburger is tapped', () => {
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
  });

  it('closes once a navigation completes', () => {
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);

    events.next(new NavigationEnd(1, '/equipment', '/equipment'));

    expect(component.menuOpen).toBe(false);
  });

  it('closes as soon as a link inside the panel is tapped', () => {
    component.toggleMenu();

    const anchor = document.createElement('a');
    const nav = document.createElement('nav');
    nav.appendChild(anchor);
    component.onNavClick({ target: anchor } as unknown as Event);

    expect(component.menuOpen).toBe(false);
  });

  it('stays open when the panel background is tapped', () => {
    component.toggleMenu();

    const nav = document.createElement('nav');
    component.onNavClick({ target: nav } as unknown as Event);

    expect(component.menuOpen).toBe(true);
  });

  it('also clears any open submenu', () => {
    component.toggleMenu();
    component.toggleSubmenu();
    component.openMenu('socialmedia');

    events.next(new NavigationEnd(1, '/blog', '/blog'));

    expect(component.menuOpen).toBe(false);
    expect(component.submenuOpen).toBe(false);
    expect(component.open).toBeNull();
  });

  it('stops listening when destroyed', () => {
    component.toggleMenu();
    component.ngOnDestroy();

    events.next(new NavigationEnd(1, '/blog', '/blog'));

    // No error, and the subscription is gone so nothing reopened or threw.
    expect(component.menuOpen).toBe(true);
  });
});
