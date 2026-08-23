/**
 * Meta title and description per page.
 *
 * Keyed by route path (no leading slash, no trailing slash). AppComponent
 * applies the matching entry on every navigation, so this file is the single
 * place page titles and descriptions are edited.
 *
 * Pages built from content — a blog post, an equipment guide, an author —
 * are not listed here: they set their own title and description from the
 * record they load.
 */
export interface PageMeta {
  title: string;
  description: string;
}

/** Used for any route without its own entry, so a title never carries over. */
export const DEFAULT_PAGE_META: PageMeta = {
  title: 'YouTube Tools & Creator Resources | YT Creator',
  description:
    'YouTube tools, SEO resources, and creator guides to help you optimize ' +
    'videos, improve discoverability, and grow your channel with practical strategies.'
};

export const PAGE_META: { [path: string]: PageMeta } = {
  '': {
    title: 'YouTube Tools & Creator Resources | YT Creator',
    description:
      'YouTube tools, SEO resources, and creator guides to help you optimize ' +
      'videos, improve discoverability, and grow your channel with practical strategies.'
  },

  'aboutus': {
    title: 'About YT Creator | YouTube Tools & Creator Resources',
    description:
      'Learn about YT Creator, an independent platform providing practical ' +
      'YouTube SEO tools, creator resources, content optimization guidance, ' +
      'and growth strategies.'
  },

  'youtubeseo': {
    title: 'YouTube SEO Tool | Optimize Titles, Keywords & Videos',
    description:
      'Optimize your YouTube videos with practical SEO tools for titles, ' +
      'descriptions, keywords, tags, and content visibility. Improve your ' +
      'video optimization strategy.'
  },

  'socialmedia': {
    title: 'Social Media Tools for Creators & Businesses | YT Creator',
    description:
      'Free social media tools for creators and businesses, including caption, ' +
      'hashtag, bio, and content tools to create better posts and improve organic reach.'
  },

  'socialmedia/captiongenerator': {
    title: 'Free Caption & Hashtag Generator | YT Creator',
    description:
      'Generate engaging social media captions and relevant hashtags for ' +
      'Instagram, YouTube Shorts, Facebook, Reels, posts, and other content ' +
      'with YT Creator.'
  },

  'learninghub': {
    title: 'YouTube Creator Learning Hub | Guides & Resources',
    description:
      'Explore practical guides for YouTube creators covering monetization, ' +
      'content creation, equipment, common YouTube issues, and creator growth strategies.'
  },

  'equipment': {
    title: 'Creator Equipment Reviews & Guides | Cameras, Mics & More',
    description:
      'Explore creator equipment guides and reviews covering cameras, ' +
      'microphones, lighting, and accessories to help YouTubers choose the ' +
      'right gear for their content.'
  },

  'learninghub/faqs': {
    title: 'YouTube Creator FAQs | SEO, Growth & Monetization',
    description:
      'Find answers to common YouTube creator questions about channel growth, ' +
      'SEO, monetization, content creation, and common YouTube issues.'
  },

  'blog': {
    title: 'YouTube & Creator Insights | YT Creator Blog',
    description:
      'Read practical YouTube and creator insights covering SEO, content ' +
      'strategy, video production, social media updates, creator tools, and ' +
      'platform changes.'
  }
};

/**
 * Looks up the entry for a router URL. Query string and fragment are dropped,
 * and surrounding slashes trimmed, so "/blog?page=2" resolves to "blog".
 * Returns null when the page supplies its own meta (a post, a guide, an author).
 */
export function pageMetaFor(url: string): PageMeta | null {
  const path = (url || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/+|\/+$/g, '');

  return PAGE_META[path] || null;
}
