import { normaliseHeadings } from './headings.util';

/**
 * Prepares an editor-authored article body for rendering.
 *
 * Two passes, both of which the author should not have to think about:
 *   - headings are re-levelled to sit under the page's h1 (see headings.util)
 *   - images below the first are deferred, so they stop competing for
 *     bandwidth with the text and the one image that is actually on screen
 *
 * The first image keeps eager loading and is given fetch priority: on an
 * article it is usually the largest thing above the fold, so it is frequently
 * the element LCP is measured against.
 */
export function prepareArticleBody(html: string | null | undefined): string {
  return markImages(normaliseHeadings(html));
}

function markImages(html: string): string {
  let index = 0;

  return html.replace(/<img\b[^>]*>/gi, tag => {
    const first = index++ === 0;

    // An author may already have set these; never override their choice.
    const hasLoading = /\bloading\s*=/i.test(tag);
    const hasDecoding = /\bdecoding\s*=/i.test(tag);
    const hasPriority = /\bfetchpriority\s*=/i.test(tag);

    const additions: string[] = [];

    if (first) {
      if (!hasPriority) additions.push('fetchpriority="high"');
    } else {
      if (!hasLoading) additions.push('loading="lazy"');
      if (!hasDecoding) additions.push('decoding="async"');
    }

    if (!additions.length) return tag;

    // Insert before the closing bracket, keeping a self-closing tag valid.
    return tag.replace(/\s*\/?>$/, ' ' + additions.join(' ') + '$&').replace(/\s+(\/?>)/, ' $1');
  });
}
