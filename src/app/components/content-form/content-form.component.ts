import { Component, EventEmitter, Output } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { ContentRequest, ContentResponse } from '../../models/content.model';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

@Component({
    selector: 'app-content-form',
    templateUrl: './content-form.component.html',
    styleUrls: ['./content-form.component.css'],
    standalone: false
})
export class ContentFormComponent {
  @Output() contentGenerated = new EventEmitter<ContentResponse>();

  currentStep = 1;

  // Exact YouTube categories as specified
  categories = [
    'None',
    'Autos & Vehicles',
    'Comedy',
    'Education',
    'Entertainment',
    'Film & Animation',
    'Gaming',
    'Howto & Style',
    'Music',
    'News & Politics',
    'Nonprofits & Activism',
    'People & Blogs',
    'Pets & Animals',
    'Science & Technology',
    'Sports',
    'Travel & Events'
  ];

  selectedCategory = '';
  formData: { [key: string]: string } = {};
  currentFields: FormField[] = [];

  isLoading = false;
  errorMessage = '';

  // Category field definitions
  private categoryFields: { [key: string]: FormField[] } = {
    'Education': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Photosynthesis explained for Class 10' },
      { name: 'targetGrade', label: 'Target Grade/Class', type: 'text', required: false, placeholder: 'e.g., Grade 10, Class 12, College' },
      { name: 'targetExam', label: 'Target Exam', type: 'text', required: false, placeholder: 'e.g., JEE, NEET, SAT, UPSC' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi, Spanish' }
    ],
    'Autos & Vehicles': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Tesla Model 3 2024 Full Review' },
      { name: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true, options: ['Car', 'Bike', 'EV', 'Truck', 'SUV', 'Other'] },
      { name: 'modelName', label: 'Model Name', type: 'text', required: false, placeholder: 'e.g., Tesla Model 3, Honda Civic' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Review', 'Test Drive', 'Comparison', 'Maintenance Tips', 'Other'] },
      { name: 'location', label: 'Location/Country', type: 'text', required: false, placeholder: 'e.g., USA, India, UK' }
    ],
    'Comedy': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Office pranks gone wrong' },
      { name: 'comedyType', label: 'Type of Comedy', type: 'select', required: true, options: ['Sketch', 'Stand-up', 'Spoof', 'Prank', 'Sitcom', 'Other'] },
      { name: 'comedianName', label: 'Main Character/Comedian Name', type: 'text', required: false, placeholder: 'e.g., John Doe' },
      { name: 'language', label: 'Language', type: 'text', required: true, placeholder: 'e.g., English, Hindi' }
    ],
    'Entertainment': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Mission Impossible review and breakdown' },
      { name: 'actorName', label: 'Actor/Hero Name', type: 'text', required: false, placeholder: 'e.g., Tom Cruise' },
      { name: 'movieName', label: 'Movie/Series Name', type: 'text', required: false, placeholder: 'e.g., Mission Impossible' },
      { name: 'language', label: 'Language', type: 'text', required: true, placeholder: 'e.g., English, Hindi' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Review', 'Breakdown', 'News', 'Trailer Reaction', 'Interview', 'Other'] }
    ],
    'Film & Animation': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Animated adventure short film' },
      { name: 'filmStyle', label: 'Film/Animation Style', type: 'select', required: true, options: ['2D Animation', '3D Animation', 'Anime', 'Short Film', 'Stop Motion', 'Other'] },
      { name: 'storyTheme', label: 'Story Theme', type: 'text', required: false, placeholder: 'e.g., Adventure, Romance, Sci-Fi' },
      { name: 'targetAudience', label: 'Target Audience', type: 'select', required: true, options: ['Kids', 'Teens', 'Adults', 'All Ages'] },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi' }
    ],
    'Gaming': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Minecraft survival guide for beginners' },
      { name: 'gameTitle', label: 'Game Title', type: 'text', required: true, placeholder: 'e.g., Minecraft, Call of Duty' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Gameplay', 'Tutorial', 'Live Stream', 'Tips & Tricks', 'Review', 'Walkthrough'] },
      { name: 'skillLevel', label: 'Skill Level', type: 'select', required: false, options: ['Beginner', 'Intermediate', 'Pro', 'All Levels'] },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['PC', 'PlayStation', 'Xbox', 'Mobile', 'Nintendo', 'Multi-Platform'] }
    ],
    'Howto & Style': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Easy makeup tutorial for beginners' },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Beginners, Professionals, Everyone' },
      { name: 'materials', label: 'Materials/Tools used', type: 'text', required: false, placeholder: 'e.g., Flour, eggs, mixer' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi' }
    ],
    'Music': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Shape of You acoustic cover' },
      { name: 'songName', label: 'Song Name', type: 'text', required: false, placeholder: 'e.g., Shape of You' },
      { name: 'artistName', label: 'Artist Name', type: 'text', required: false, placeholder: 'e.g., Ed Sheeran' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Cover', 'Remix', 'Lyrics', 'Reaction', 'Music Video', 'Original', 'Tutorial'] },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi' }
    ],
    'News & Politics': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., 2024 election results analysis' },
      { name: 'location', label: 'Location/Region', type: 'text', required: true, placeholder: 'e.g., USA, India, Europe' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Breaking News', 'Analysis', 'Opinion', 'Explainer', 'Interview', 'Debate'] },
      { name: 'timeframe', label: 'Date or Timeframe', type: 'text', required: false, placeholder: 'e.g., January 2024, Today' }
    ],
    'Nonprofits & Activism': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Clean water campaign in Africa' },
      { name: 'causeName', label: 'Cause/Issue Name', type: 'text', required: false, placeholder: 'e.g., Clean Water Initiative, Animal Rescue' },
      { name: 'location', label: 'Target Location', type: 'text', required: true, placeholder: 'e.g., Africa, India, USA' },
      { name: 'targetAudience', label: 'Audience', type: 'select', required: true, options: ['Donors', 'Volunteers', 'Public Awareness', 'All'] },
      { name: 'eventName', label: 'Event Name', type: 'text', required: false, placeholder: 'e.g., Charity Marathon 2024' }
    ],
    'People & Blogs': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., My daily routine vlog' },
      { name: 'vlogType', label: 'Vlog Type', type: 'select', required: true, options: ['Travel', 'Daily Vlog', 'Storytime', 'Advice', 'Challenge', 'Q&A', 'Other'] },
      { name: 'location', label: 'Location', type: 'text', required: false, placeholder: 'e.g., New York, Home, Park' },
      { name: 'personName', label: 'Person Name', type: 'text', required: false, placeholder: 'e.g., John Doe' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi' }
    ],
    'Pets & Animals': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Dog training tips for puppies' },
      { name: 'animalType', label: 'Animal Type', type: 'text', required: true, placeholder: 'e.g., Dog, Cat, Bird, Wildlife' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Training', 'Feeding Tips', 'Funny Moments', 'Health', 'Rescue', 'Care Guide'] },
      { name: 'petName', label: 'Pet Name', type: 'text', required: false, placeholder: 'e.g., Buddy, Max' },
      { name: 'targetAudience', label: 'Target Audience', type: 'select', required: false, options: ['Pet Owners', 'Kids', 'General', 'All'] }
    ],
    'Science & Technology': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., iPhone 15 Pro full review and comparison' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Review', 'Comparison', 'Tutorial', 'News', 'Explanation', 'Unboxing'] },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Tech enthusiasts, Beginners, Professionals' },
      { name: 'brandName', label: 'Device/Brand Name', type: 'text', required: false, placeholder: 'e.g., Apple, Samsung, Tesla' }
    ],
    'Sports': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., NBA Finals 2024 highlights and analysis' },
      { name: 'sportType', label: 'Sport Type', type: 'text', required: true, placeholder: 'e.g., Football, Basketball, Cricket' },
      { name: 'playerName', label: 'Team/Player Name', type: 'text', required: false, placeholder: 'e.g., Cristiano Ronaldo, Lakers' },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['Highlights', 'Analysis', 'Prediction', 'Training Tips', 'Match Review', 'Interview'] },
      { name: 'tournamentName', label: 'League/Tournament Name', type: 'text', required: false, placeholder: 'e.g., FIFA World Cup, NBA Finals' }
    ],
    'Travel & Events': [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., Budget travel guide to Paris' },
      { name: 'destinationName', label: 'Destination Name', type: 'text', required: true, placeholder: 'e.g., Paris, Tokyo, Maldives' },
      { name: 'travelType', label: 'Travel Type', type: 'select', required: true, options: ['Guide', 'Vlog', 'Budget Travel', 'Food Tour', 'Adventure', 'Luxury Travel'] },
      { name: 'duration', label: 'Duration/Date', type: 'text', required: false, placeholder: 'e.g., 5 days, December 2024' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'e.g., English, Hindi' }
    ]
  };

  constructor(private contentService: ContentService) { }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Education': '🎓',
      'Autos & Vehicles': '🚗',
      'Comedy': '😂',
      'Entertainment': '🎭',
      'Film & Animation': '🎬',
      'Gaming': '🎮',
      'Howto & Style': '🛠',
      'Music': '🎵',
      'News & Politics': '📰',
      'Nonprofits & Activism': '❤️',
      'People & Blogs': '👥',
      'Pets & Animals': '🐾',
      'Science & Technology': '🔬',
      'Sports': '🏀',
      'Travel & Events': '✈️'
    };
    return icons[category] || '📂';
  }

  onCategorySelect() {
    this.errorMessage = '';
  }

  nextStep() {
    if (!this.selectedCategory) {
      this.errorMessage = 'Please select a category';
      return;
    }

    if (this.selectedCategory === 'None') {
      this.errorMessage = 'Please select a valid category';
      return;
    }

    // Load fields for selected category
    this.currentFields = this.categoryFields[this.selectedCategory] || [];
    this.formData = {};
    this.errorMessage = '';
    this.currentStep = 2;
  }

  previousStep() {
    this.currentStep = 1;
    this.errorMessage = '';
  }

  onSubmit() {
    // Validate required fields
    for (const field of this.currentFields) {
      if (field.required && (!this.formData[field.name] || !this.formData[field.name].trim())) {
        this.errorMessage = `${field.label} is required`;
        return;
      }
    }

    // Build request data with ONLY category-specific fields
    const requestData: ContentRequest = {
      category: this.selectedCategory,
      generateArea: "ytseo"
    };

    // Add only the fields that belong to the current category
    this.currentFields.forEach(field => {
      const value = this.formData[field.name];
      if (value && value.trim()) {
        requestData[field.name] = value.trim();
      }
    });

    // Log request data for debugging
    console.log('=== Request Body for', this.selectedCategory, '===');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('Fields sent:', Object.keys(requestData).filter(k => k !== 'category'));

    this.isLoading = true;
    this.errorMessage = '';

    this.contentService.generateContent(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.contentGenerated.emit(response.data);
        this.currentStep = 3;
        console.log('✅ Content generated successfully');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || error.error?.error || 'Failed to generate content. Please try again.';
        console.error('❌ Error generating content:', error);
      }
    });
  }

  resetForm() {
    //this.selectedCategory = '';
    this.formData = {};
    this.currentFields = [];
    this.errorMessage = '';
    this.currentStep = 1;
  }
}
