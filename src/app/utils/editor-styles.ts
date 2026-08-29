/**
 * Loads the editor's stylesheets on demand.
 *
 * CKEditor's CSS is ~230 KB — about 90% of what the global stylesheet used to
 * be — and only the two admin editors need it. Importing it into styles.css
 * meant every visitor downloaded it as a render-blocking request. It is now
 * fetched here, when an editor actually opens.
 *
 * Order matters: ckeditor5.css first, then editor-styles.css, whose rules
 * override CKEditor's defaults (the font, mainly).
 */
const SHEETS = [
  { id: 'ckeditor5-styles', href: 'assets/ckeditor5.css' },
  { id: 'editor-overrides', href: 'assets/editor-styles.css' }
];

export function ensureEditorStyles(document: Document): void {
  for (const sheet of SHEETS) {
    // Both editors call this; only the first call adds anything.
    if (document.getElementById(sheet.id)) continue;

    const link = document.createElement('link');
    link.id = sheet.id;
    link.rel = 'stylesheet';
    link.href = sheet.href;
    document.head.appendChild(link);
  }
}
