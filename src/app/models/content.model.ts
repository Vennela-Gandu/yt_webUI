export interface ContentRequest {
  category: string;
  [key: string]: string | undefined;
  generateArea: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContentResponse {
  titles: string[];
  description: string;
  keywords: string[];
  hashtags: string[];
  faqs: FAQ[];
  captions: string[];

  trendingMusic: TrendingMusic[]
}
export interface TrendingMusic {
  title: string;
  artist: string;
  url: string;
}

export interface ApiResponse {
  success: boolean;
  data: ContentResponse;
}
