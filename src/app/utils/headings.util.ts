/**
 * Re-levels the headings inside an article body.
 *
 * The page title is the h1, so the body's own headings should start at h2 and
 * descend from there. Authors write in the editor without knowing that, so a
 * body commonly opens at h3 or h4 — which reads to a crawler as a skipped
 * level — and occasionally at h1, which gives the page two.
 *
 * The shallowest heading in the body is moved to h2 and every other heading
 * moves by the same amount, so the author's own structure is preserved exactly;
 * only its starting depth changes. Text, attributes and inline markup are
 * untouched.
 */
export function normaliseHeadings(html: string | null | undefined): string {
  const body = html || '';

  const levels = [...body.matchAll(/<h([1-6])\b/gi)].map(m => Number(m[1]));
  if (!levels.length) {
    return body;
  }

  const shallowest = Math.min(...levels);
  const shift = 2 - shallowest;
  if (shift === 0) {
    return body;
  }

  // Clamp at h6: a deep document shifted down must not produce an <h7>.
  return body.replace(/<(\/?)h([1-6])\b/gi, (whole, slash, level) => {
    const next = Math.min(6, Math.max(2, Number(level) + shift));
    return '<' + slash + 'h' + next;
  });
}
