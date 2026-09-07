/** Where a relative image path is resolved from, for share tags. */
const SITE_URL = 'https://www.ytcreator.in/';

/**
 * The image that represents an article when its link is shared.
 *
 * The featured image if the record has one, otherwise the first picture in the
 * body that a crawler could actually fetch. Returns null when the article has
 * no such image, so the caller can clear the tags rather than leave a previous
 * page's picture attached.
 */
export function shareImageFor(record: any, body: string | null | undefined): string | null {
  const featured = usable(String(record?.featuredImage || '').trim());
  if (featured) {
    return featured;
  }

  // Not simply the first <img>: some articles open with an image pasted into
  // the editor as a base64 data URI, which no crawler can retrieve. Those are
  // skipped in favour of the first one that resolves to a real URL.
  const matches = String(body || '').matchAll(/<img[^>]+src=["']([^"']+)["']/gi);

  for (const match of matches) {
    const url = usable(match[1]);
    if (url) {
      return url;
    }
  }

  return null;
}

/**
 * An absolute, fetchable URL for the image, or null if it is not something a
 * share crawler can retrieve.
 *
 * Share tags need an absolute URL: a crawler fetching the page has no document
 * to resolve a relative path against, so a relative src would be dropped.
 * data: and blob: URLs are rejected outright — they carry the bytes inline and
 * mean nothing to anything fetching the page separately.
 */
function usable(url: string): string | null {
  if (!url) {
    return null;
  }

  if (/^(data|blob):/i.test(url)) {
    return null;
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('//')) {
    return url;
  }

  return SITE_URL + url.replace(/^\/+/, '');
}
