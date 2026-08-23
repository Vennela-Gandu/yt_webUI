import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { EquipmentService } from '../services/equipment.service';
import { AuthorService, Author } from '../services/author.service';
import { SeoService } from '../services/seo.service';
import { toSlug } from '../utils/slug.util';
import { withPostDates } from '../utils/date.util';

/**
 * One author's public page at /author/<slug>: their profile, then everything
 * they have published. Linked from the byline on the blog list, a post, and an
 * equipment guide.
 */
@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css'],
  standalone: false
})
export class AuthorComponent implements OnInit {

  author: Author | null = null;
  posts: any[] = [];
  equipment: any[] = [];

  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private equipmentService: EquipmentService,
    private authorService: AuthorService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    // Re-read on param change so /author/a -> /author/b works without a
    // full page reload.
    this.route.params.subscribe(params => {
      this.load(params['name'] || '');
    });
  }

  private load(slug: string): void {
    this.isLoading = true;
    this.notFound = false;
    this.author = null;
    this.posts = [];
    this.equipment = [];

    if (!slug) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    this.authorService.getBySlug(slug).subscribe({
      next: author => {
        this.author = author;
        this.isLoading = false;

        this.seo.setPageMeta(
          `${author.name} | Author at YT Creator`,
          author.bio || `Articles and equipment guides by ${author.name} on YT Creator.`
        );

        this.loadContent(author.name);
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  /** Posts and equipment guides are both credited by author name. */
  private loadContent(name: string): void {
    this.postService.getPostsByCategory(1, 50, '', -1, name).subscribe({
      next: res => {
        this.posts = (res?.posts || []).map((p: any) =>
          withPostDates({ ...p, slug: toSlug(p.title) })
        );
      },
      error: () => this.posts = []
    });

    this.equipmentService.getList(1, 50, '', null, true, name).subscribe({
      next: res => {
        this.equipment = (res?.equipments || []).map((e: any) =>
          withPostDates({ ...e, slug: toSlug(e.title) })
        );
      },
      error: () => this.equipment = []
    });
  }

  /** Social links, only the ones this author actually filled in. */
  get socialLinks(): { icon: string; url: string; label: string }[] {
    if (!this.author) return [];

    return [
      { icon: 'fa-brands fa-youtube', url: this.author.youtubeUrl || '', label: 'YouTube' },
      { icon: 'fa-brands fa-instagram', url: this.author.instagramUrl || '', label: 'Instagram' },
      { icon: 'fa-brands fa-linkedin', url: this.author.linkedinUrl || '', label: 'LinkedIn' },
      { icon: 'fa-brands fa-x-twitter', url: this.author.xUrl || '', label: 'X' }
    ].filter(link => !!link.url);
  }

  /** "venkatesh" -> "Venkatesh" for display; the stored value stays as-is. */
  get displayName(): string {
    const name = this.author?.name || '';
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  }

  get initials(): string {
    return (this.author?.name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  openPost(post: any): void {
    this.router.navigate(['/blog', post.slug, post.postID]);
  }

  openEquipment(item: any): void {
    this.router.navigate(['/equipment-detail', item.slug]);
  }
}
