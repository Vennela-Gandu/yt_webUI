const fs = require('fs');
const path = require('path');

const root = process.cwd();
const distDir = path.join(root, 'dist');

// Read root package.json
const pkgPath = path.join(root, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('root package.json not found');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Build minimal package.json for dist
const out = {
  name: pkg.name ? `${pkg.name}-dist` : 'frontend-dist',
  version: pkg.version || '1.0.0',
  private: true,
  main: 'server/server.mjs',
  scripts: {
    start: 'node server/server.mjs'
  },
  dependencies: pkg.dependencies || {}
};

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found, skipping creation of dist/package.json');
  process.exit(0);
}

const outPath = path.join(distDir, 'package.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Created', outPath);
