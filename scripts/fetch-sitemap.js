const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.API_BASE || process.env.API_URL || 'https://api.ytcreator.in';
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUT_DIR = DIST_DIR; // write files to dist root
const FILES = ['/sitemap.xml', '/sitemap-pages.xml', '/sitemap-tools.xml', '/sitemap-blog.xml'];

// If you need to ignore TLS verification in build environment (dev only), set SKIP_TLS_VERIFY=true
if (process.env.SKIP_TLS_VERIFY === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function fetchFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(filePath, API_BASE).toString();
      const client = url.startsWith('https:') ? https : http;

      console.log(`Fetching sitemap from ${url} ...`);

      const req = client.get(url, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to fetch ${url}: status ${res.statusCode}`));
        }

        const outPath = path.join(OUT_DIR, filePath.replace(/^\//, ''));
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const fileStream = fs.createWriteStream(outPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Wrote ${outPath}`);
          resolve(outPath);
        });
        fileStream.on('error', (err) => reject(err));
      });

      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

(async function main() {
  try {
    for (const f of FILES) {
      try {
        await fetchFile(f);
      } catch (e) {
        // Log and continue with other files
        console.warn(e.message || e);
      }
    }
    console.log('Sitemap fetch completed');
  } catch (err) {
    console.error('Sitemap fetch failed', err);
    process.exit(1);
  }
})();
