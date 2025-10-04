#!/usr/bin/env node
// Minimal CSS build: emit a CSS file representing some tokens for consumers
// In a real setup this would transform design tokens to CSS variables.

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const outFile = path.join(distDir, 'tokens.css');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const css = `/* OptimUI Tokens (minimal) */
:root{
  --optimui-color-primary-500: hsl(217, 91%, 50%);
  --optimui-spacing-4: 1rem;
  --optimui-radius-md: 0.375rem;
  --optimui-shadow-base: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
}
`;

fs.writeFileSync(outFile, css, 'utf8');
console.log(`Wrote ${outFile}`);
