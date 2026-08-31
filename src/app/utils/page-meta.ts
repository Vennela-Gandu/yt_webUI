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
    title: 'YouTube SEO Tool & Video Optimization Guide | YT Creator',
    description:
      'Generate SEO-optimized YouTube titles, descriptions, tags, hashtags, ' +
      'and FAQs with our free YouTube SEO tool. Improve discoverability and ' +
      'reach more viewers.'
  },

  'socialmedia': {
    title: 'Social Media Growth Tools for Creators',
    description:
      'Free social media tools for creators, including caption, hashtag and bio ' +
      'generators. Create platform-specific content and improve your social media workflow.'
  },

  'socialmedia/captiongenerator': {
    title: 'Free Caption & Hashtag Generator for Social Media | YT Creator',
    description:
      'Generate captivating social media captions instantly with YTCreator. ' +
      'Save time, craft tone-matched posts, and boost engagement across all ' +
      'platforms for free.'
  },

  'learninghub': {
    title: 'YouTube Creator Learning Hub | Guides & Resources',
    description:
      'Explore practical guides for YouTube creators covering monetization, ' +
      'content creation, equipment, common YouTube issues, and creator growth strategies.'
  },

  'aboutus/editorial-policy': {
    title: 'Editorial & Publishing Policy | YT Creator',
    description:
      'How YT Creator researches, fact-checks, reviews and publishes: our ' +
      'editorial standards for articles, equipment reviews, creator tools, ' +
      'and our responsible AI policy.'
  },

  'equipment': {
    title: 'Best Creator Equipment for YouTube & Video Production',
    description:
      'We help creators and educators choose cameras, microphones, lighting, ' +
      'and production gear based on their content, budget, and practical needs.'
  },

  'learninghub/faqs': {
    title: 'Content Creator FAQs – YouTube, Social Media & Monetization',
    description:
      'Get answers to YouTube and social media questions covering monetization, ' +
      'SEO, views, copyright, policies, account issues, content creation, and creator growth.'
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
