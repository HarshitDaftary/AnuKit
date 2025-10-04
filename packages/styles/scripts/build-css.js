#!/usr/bin/env node

/**
 * Minimal CSS build script for @optimui/styles
 * Copies CSS files from src to dist
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '../src');
const distDir = join(__dirname, '../dist');

// Create dist directory if it doesn't exist
try {
  mkdirSync(distDir, { recursive: true });
} catch (e) {
  // Directory already exists
}

// Copy CSS files
function copyCssFiles(dir) {
  try {
    const files = readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.css')) {
        const content = readFileSync(join(dir, file), 'utf8');
        writeFileSync(join(distDir, file), content);
        console.log(`✓ Built ${file}`);
      }
    });
  } catch (e) {
    console.log('No CSS files found to build');
  }
}

copyCssFiles(srcDir);
console.log('CSS build complete');
