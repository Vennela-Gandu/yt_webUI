/**
 * The brand's own social profiles.
 *
 * One list, used in three places: the header bar, the footer, and the
 * Organization `sameAs` in the JSON-LD (which is how search engines tie these
 * profiles to the site as one entity). Add or change a profile here.
 *
 * `label` is the accessible/anchor text for the icon link — an icon on its own
 * gives a crawler and a screen reader nothing to read.
 */
export interface SocialLink {
  /** Accessible name and anchor text, e.g. "YT Creator on Facebook". */
  label: string;
  /** Short name used in the tooltip. */
  name: string;
  url: string;
  /** Font Awesome brand icon class. */
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Facebook',
    label: 'YT Creator on Facebook',
    url: 'https://www.facebook.com/ytcreator.in',
    icon: 'fa-brands fa-facebook-f'
  },
  {
    name: 'WhatsApp',
    label: 'YT Creator WhatsApp channel',
    url: 'https://whatsapp.com/channel/0029Vb6jlyA2Jl8IVFZUZX3M',
    icon: 'fa-brands fa-whatsapp'
  },
  {
    name: 'Instagram',
    label: 'YT Creator on Instagram',
    url: 'https://www.instagram.com/yt.creator.in/',
    icon: 'fa-brands fa-instagram'
  },
  {
    name: 'X',
    label: 'YT Creator on X (Twitter)',
    url: 'https://x.com/ytcreator_in/',
    icon: 'fa-brands fa-x-twitter'
  },
  {
    name: 'YouTube',
    label: 'YT Creator on YouTube',
    url: 'https://www.youtube.com/@ytcreator_in',
    icon: 'fa-brands fa-youtube'
  },
  {
    name: 'LinkedIn',
    label: 'YT Creator on LinkedIn',
    url: 'https://www.linkedin.com/company/ytcreator/',
    icon: 'fa-brands fa-linkedin'
  }
];

/** Just the URLs, for the Organization `sameAs` property. */
export const SOCIAL_PROFILE_URLS = SOCIAL_LINKS.map(link => link.url);
