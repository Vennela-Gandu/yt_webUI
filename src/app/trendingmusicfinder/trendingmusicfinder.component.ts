import { Component } from '@angular/core';
import { ContentService } from '../services/content.service';
import { ContentRequest } from '../models/content.model';

@Component({
    selector: 'app-trendingmusicfinder',
    templateUrl: './trendingmusicfinder.component.html',
    styleUrls: ['./trendingmusicfinder.component.css'],
    standalone: false
})
export class TrendingmusicfinderComponent {


  platforms = [
    'Spotify',
    'Apple Music',
    'YouTube',
    'TikTok',
    'Instagram'
  ];
  types = [
    { label: 'Trending Songs', value: 'song' },
    { label: 'Trending Genres', value: 'genre' },
    { label: 'Viral Audio', value: 'viral' }
  ];

  selectedPlatform = '';
  selectedType = '';
  isLoading = false;
  errorMessage = '';

  trendingMusic: {
    title: string;
    artist: string;
    url: string;
  }[] = [];

  constructor(private contentService: ContentService) { }

  getTrendingMusic() {
    if (!this.selectedPlatform) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.trendingMusic = [];

    const requestData: ContentRequest = {
        platform: this.selectedPlatform,
      category: this.selectedType,
      topic: this.selectedType,
      location: "India",
      generateArea:"music"
    };

    this.contentService.generateContent(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.trendingMusic = response.data?.trendingMusic || [];
        console.log('✅ Trending music loaded');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to fetch trending music. Please try again.';
        console.error('❌ Error:', error);
      }
    });
  }
}


