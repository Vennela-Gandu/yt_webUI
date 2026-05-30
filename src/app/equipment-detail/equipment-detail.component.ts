import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css'],
  standalone: false
})
export class EquipmentDetailComponent implements OnInit {

  slug: string | null = null;

  equipment: any = null;

  /* TEMP DATA (replace with API later) */
  equipments = [
    {
      slug: 'best-ring-lights-for-youtube-creators',
      title: 'Best Ring Lights for YouTube Creators',
      shortDescription: 'Top ring lights to improve video lighting.',
      content: `
        <p>Ring lights are one of the most important tools for content creators.</p>

        <h2>Why Ring Lights Are Important</h2>
        <p>They provide even lighting and reduce harsh shadows.</p>

        <h2>Best Use Cases</h2>
        <ul>
          <li>YouTube videos</li>
          <li>Instagram reels</li>
          <li>Online teaching</li>
        </ul>

        <p>Choose ring lights based on size, brightness and color temperature.</p>
      `,
      category: 'Lighting Equipment',
      subCategory: 'Ring Lights'
    },
    {
      slug: 'usb-microphones-under-10000',
      title: 'USB Microphones Under ₹10,000',
      shortDescription: 'Affordable microphones for clear audio.',
      content: `
        <p>USB microphones are perfect for beginners.</p>

        <h2>Advantages of USB Microphones</h2>
        <ul>
          <li>Easy plug and play</li>
          <li>No audio interface needed</li>
        </ul>

        <p>Choose microphones based on sound quality and build.</p>
      `,
      category: 'Audio Equipment',
      subCategory: 'USB Microphones'
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.equipment = this.equipments.find(e => e.slug === this.slug);
  }
}
