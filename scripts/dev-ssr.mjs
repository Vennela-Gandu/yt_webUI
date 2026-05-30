// Dev-only launcher: bypasses TLS verification so the SSR Node process can
// call the local .NET API on https://localhost:7000 with its self-signed cert.
// Never use in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
await import('../dist/Frontend/server/server.mjs');
