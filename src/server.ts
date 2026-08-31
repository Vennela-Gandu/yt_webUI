import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { join } from 'path';
import AppServerModule from './main.server';

const app = express();

// Default to the Angular build output. In production (Plesk/cPanel) where the
// browser bundle is copied to `httpdocs/`, set BROWSER_DIST=httpdocs at runtime.
const distBrowser = join(process.cwd(), process.env['BROWSER_DIST'] || 'dist/Frontend/browser');
const distServer = join(process.cwd(), process.env['SERVER_DIST'] || 'dist/Frontend/server');

const engine = new CommonEngine();

// Sitemaps are built from live DB content by the API, so proxy them through on
// every request rather than shipping a build-time snapshot. Registered ahead of
// express.static so a stale sitemap*.xml in the bundle can never shadow it.
// NOTE: IIS serves real files straight off disk (see plesk-web.config), so any
// sitemap*.xml left in httpdocs would win before this handler is ever reached.
const apiBase = process.env['API_BASE'] || 'https://api.ytcreator.in';

app.get(/^\/sitemap(-[a-z]+)?\.xml$/, async (req, res) => {
  try {
    // fetch() sends no User-Agent by default, which Cloudflare's bot protection
    // treats as suspicious and answers with 403. Identify ourselves explicitly.
    const upstream = await fetch(`${apiBase}${req.path}`, {
      headers: {
        'User-Agent': 'ytcreator-ssr/1.0',
        'Accept': 'application/xml'
      }
    });
    if (!upstream.ok) {
      // IIS replaces our error body with its own page, so the reason only ever
      // reaches us through the iisnode log — record enough to act on.
      const body = (await upstream.text()).slice(0, 300).replace(/\s+/g, ' ');
      console.error(`SITEMAP UPSTREAM ${upstream.status} for ${apiBase}${req.path} :: ${body}`);
      res.status(upstream.status).type('text/plain').send('Sitemap unavailable');
    } else {
      res.type('application/xml')
         .set('Cache-Control', 'public, max-age=3600')
         .send(await upstream.text());
    }
  } catch (err) {
    console.error(`SITEMAP ERROR: ${req.path}`, err);
    res.status(502).type('text/plain').send('Sitemap temporarily unavailable');
  }
});

// ✅ serve static
//
// In production IIS serves these files straight off disk (see
// plesk-web.config) and this never runs — but it must agree with that config
// so local runs and any request IIS does hand over behave the same way.
//
// Hashed bundles are immutable: a change produces a new filename. Everything
// else keeps its name when edited, so it gets a short life instead.
const IMMUTABLE = /-[A-Z0-9]{8}\.(?:js|css|mjs)$/;

app.use(express.static(distBrowser, {
  index: false,
  setHeaders: (res, filePath) => {
    res.setHeader(
      'Cache-Control',
      IMMUTABLE.test(filePath)
        ? 'public, max-age=31536000, immutable'
        // Everything else keeps its name when its contents change, so it must
        // be revalidated rather than trusted for a day. A dev build emits
        // unhashed bundles and renames its lazy chunks every time: a cached
        // main.js then asks for a chunk that no longer exists, and the lazy
        // route it points at silently fails to load. ETags make the
        // revalidation a cheap 304.
        : 'public, no-cache'
    );
  }
}));

// 🔥 fix static routing manually
// app.get('/:file', (req, res, next) => {
//   res.sendFile(join(distBrowser, req.params.file), err => {
//     if (err) next();
//   });
// });


// SSR
app.get('*', async (req, res) => {
  try {
    const html = await engine.render({
      bootstrap: AppServerModule,
      url: req.url,
      documentFilePath: join(distServer, 'index.server.html'),
      // Where the stylesheets the document links actually live. Without it the
      // engine resolves them against the server folder, fails to find them, and
      // silently skips inlining the critical CSS.
      publicPath: distBrowser,
    });

    res.send(html);

  } catch (err) {
    console.error('SSR ERROR:', err);
    res.sendFile(join(distBrowser, 'index.csr.html'));
  }
});

const port = process.env["PORT"] || 3000;

app.listen(port, () => {
  console.log(`SSR running on http://localhost:${port}`);
});