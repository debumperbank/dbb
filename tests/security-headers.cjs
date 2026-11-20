const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const src = fs.readFileSync(path.join(__dirname, '../next.config.mjs'), 'utf8');

test('response headers keep the existing baseline', () => {
  for (const value of [
    "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    "X-Frame-Options",
    "DENY",
    "X-Content-Type-Options",
    "nosniff",
    "strict-origin-when-cross-origin",
    "no-referrer",
  ]) assert.ok(src.includes(value), value);
});

test('low-risk isolation headers are present', () => {
  for (const value of [
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy",
    "same-origin",
    "X-Permitted-Cross-Domain-Policies",
    "none",
    "accelerometer=()",
    "gyroscope=()",
    "magnetometer=()",
    "usb=()",
    "bluetooth=()",
    "display-capture=()",
  ]) assert.ok(src.includes(value), value);
  assert.equal(src.includes("script-src"), false);
  assert.equal(src.includes("require-corp"), false);
});
