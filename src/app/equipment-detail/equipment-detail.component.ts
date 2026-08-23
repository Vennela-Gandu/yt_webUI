import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EquipmentService } from '../services/equipment.service';
import { SeoService } from '../services/seo.service';
import { toSlug } from '../utils/slug.util';
import { withPostDates } from '../utils/date.util';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css'],
  standalone: false
})
export class EquipmentDetailComponent implements OnInit {

  equipment: any = null;

  constructor(
    private route: ActivatedRoute,
    private service: EquipmentService,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private authorService: AuthorService
  ) { }

  /** URL segment of the author page for the byline. */
  authorSlug(name: string): string {
    return this.authorService.slugFor(name);
  }

  ngOnInit(): void {
    // Loads (and caches) the name-to-slug map the byline links with.
    this.authorService.names().subscribe();

    const slug = this.route.snapshot.paramMap.get('title');
    if (!slug) { return; }

    // The API has no "get by slug", so resolve the slug to an ID via the list,
    // then load the full record (which includes the description) by that ID.
    // publishedOnly: a scheduled guide must not be readable by URL before its
    // time — the list page hides it, so the detail page has to as well.
    this.service.getList(1, 1000, '', null, true).subscribe(list => {
      const match = (list.equipments || [])
        .find((e: any) => toSlug(e.title) === slug);
      if (!match) { return; }

      this.service.getById(match.equipmentID).subscribe(res => {
        if (!res) { return; }
        const cats = res.categories || [];
        const main = cats.find((c: any) => !c.parentCategoryID);
        const sub = cats.find((c: any) => c.parentCategoryID);

        // withPostDates turns the API's zone-less UTC values into real Dates
        // and works out whether an "Updated" stamp is worth showing.
        this.equipment = withPostDates({
          ...res,
          category: main?.name || '',
          subCategory: sub?.name || '',
          // Description is HTML from the editor — trust it so it renders formatted.
          content: this.sanitizer.bypassSecurityTrustHtml(res.description || '')
        });

        // The guide supplies its own title and description, overriding the
        // route default AppComponent applied on navigation.
        this.seo.setPageMeta(
          `${res.title} | Creator Equipment | YT Creator`,
          res.shortDescription
        );
      });
    });
  }
}
