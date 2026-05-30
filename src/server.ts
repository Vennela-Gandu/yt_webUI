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

// ✅ serve static
app.use(express.static(distBrowser, {
  maxAge: '1y',
  index: false
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