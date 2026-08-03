import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { EquipmentService } from '../services/equipment.service';
import { toSlug } from '../utils/slug.util';

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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('title');
    if (!slug) { return; }

    // The API has no "get by slug", so resolve the slug to an ID via the list,
    // then load the full record (which includes the description) by that ID.
    this.service.getList(1, 1000, '', null, false).subscribe(list => {
      const match = (list.equipments || [])
        .find((e: any) => toSlug(e.title) === slug);
      if (!match) { return; }

      this.service.getById(match.equipmentID).subscribe(res => {
        if (!res) { return; }
        const cats = res.categories || [];
        const main = cats.find((c: any) => !c.parentCategoryID);
        const sub = cats.find((c: any) => c.parentCategoryID);
        this.equipment = {
          ...res,
          category: main?.name || '',
          subCategory: sub?.name || '',
          // Description is HTML from the editor — trust it so it renders formatted.
          content: this.sanitizer.bypassSecurityTrustHtml(res.description || '')
        };
      });
    });
  }
}
