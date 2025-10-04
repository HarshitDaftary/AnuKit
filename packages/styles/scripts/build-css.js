#!/usr/bin/env node
// Minimal CSS bundler: combine token CSS with globals/components/utilities placeholders

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const header = '/* OptimUI Styles (minimal) */\n';
const globals = `${header}:root{--optimui-layer-base:0;}\nbody{margin:0;font-family:system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;}`;
const components = `${header}.optimui-btn{display:inline-flex;align-items:center;gap:.5rem;border-radius:.375rem;padding:.5rem .75rem;}\n.optimui-card{border-radius:.5rem;box-shadow:var(--optimui-shadow-base);} `;
const utilities = `${header}.u-hidden{display:none !important;} .u-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}`;

fs.writeFileSync(path.join(distDir, 'globals.css'), globals);
fs.writeFileSync(path.join(distDir, 'components.css'), components);
fs.writeFileSync(path.join(distDir, 'utilities.css'), utilities);
fs.writeFileSync(path.join(distDir, 'index.css'), `${globals}\n\n${components}\n\n${utilities}`);

console.log('CSS artifacts written to', distDir);
