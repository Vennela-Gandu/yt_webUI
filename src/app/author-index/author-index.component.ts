import { Component, OnInit } from '@angular/core';
import { AuthorService, Author } from '../services/author.service';
import { SeoService } from '../services/seo.service';

/**
 * /author — everyone who writes for the site. Each card links through to that
 * author's own page.
 */
@Component({
  selector: 'app-author-index',
  templateUrl: './author-index.component.html',
  styleUrls: ['./author-index.component.css'],
  standalone: false
})
export class AuthorIndexComponent implements OnInit {

  authors: Author[] = [];
  isLoading = true;

  constructor(
    private service: AuthorService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setPageMeta(
      'Our Authors | YT Creator',
      'Meet the YT Creator team — the writers behind our YouTube growth articles and equipment guides.'
    );

    // activeOnly: retired authors keep their page but are not advertised here.
    this.service.list(true).subscribe({
      next: rows => {
        this.authors = rows || [];
        this.isLoading = false;
      },
      error: () => {
        this.authors = [];
        this.isLoading = false;
      }
    });
  }

  displayName(author: Author): string {
    const name = author?.name || '';
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  }

  initials(author: Author): string {
    return (author?.name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
}
