import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent {

  constructor(private router: Router, private seo: SeoService) {
  
  }

  features: Feature[] = [
    {
      icon: '⚡',
      title: 'Fast Performance',
      description: 'Enjoy ultra-fast load times and immediate performance for the best user experience.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to keep your data safe and protected at all times.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works seamlessly across all devices and screen sizes.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Built-in collaboration tools to help your team work together more effectively.'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'How do I get started with YouTube SEO?',
      answer: 'Start by researching keywords relevant to your niche, optimize your video titles, descriptions, and tags, create engaging thumbnails, and focus on viewer retention through quality content.',
      isOpen: false
    },
    {
      question: 'What is the best time to post on social media?',
      answer: 'The best posting times vary by platform and audience. Generally, weekdays between 9 AM - 3 PM work well. Analyze your audience insights to find your optimal posting schedule.',
      isOpen: false
    },
    {
      question: 'How can I analyze my competitors on YouTube?',
      answer: 'Use analytics tools to track competitor video performance, keywords, engagement rates, upload frequency, and content strategies. Identify gaps in their content you can fill.',
      isOpen: false
    },
    {
      question: 'Do I need special equipment to start creating content?',
      answer: 'Not necessarily. You can start with a smartphone and basic editing software. As you grow, invest in better equipment like cameras, microphones, and lighting based on your needs.',
      isOpen: false
    },
    {
      question: 'How do I monetize my YouTube channel?',
      answer: 'Join the YouTube Partner Program (requires 1,000 subscribers and 4,000 watch hours), enable ads, explore sponsorships, merchandise, channel memberships, and affiliate marketing.',
      isOpen: false
    },
    {
      question: 'What are YouTube Shorts and how do they work?',
      answer: 'YouTube Shorts are vertical videos up to 60 seconds long. They appear in a dedicated Shorts feed and can help you reach new audiences quickly with engaging, snackable content.',
      isOpen: false
    }
  ];

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  navigateTo(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Implement navigation logic here
    this.router.navigate([section]);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

