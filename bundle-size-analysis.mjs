#!/usr/bin/env node

/**
 * Bundle Size Optimization Analysis
 * Compares bundle sizes before and after optimization
 */

import { readFileSync, existsSync } from 'fs';
import { gzipSync } from 'zlib';

const DIST_DIR = '/Volumes/Docker-Util/react-component-libs/AnuKit/packages/components/dist';

// Function to get file size
function getFileSize(filePath) {
  if (!existsSync(filePath)) {
    return { raw: 0, gzipped: 0 };
  }
  
  const content = readFileSync(filePath, 'utf8');
  const raw = Buffer.byteLength(content, 'utf8');
  const gzipped = gzipSync(content).length;
  
  return { raw, gzipped };
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('📊 AnuKit Bundle Size Optimization Analysis\n');

// Analyze main bundle
const mainBundle = getFileSize(`${DIST_DIR}/index.esm.js`);
console.log('🎯 Main Bundle (All Components):');
console.log(`   Raw: ${formatBytes(mainBundle.raw)}`);
console.log(`   Gzipped: ${formatBytes(mainBundle.gzipped)}\n`);

// Analyze individual components
const components = [
  'Button',
  'Pagination', 
  'List',
  'DatePicker',
  'Table',
  'Form'
];

console.log('🧩 Individual Component Analysis:');
console.log('='.repeat(50));

components.forEach(component => {
  const componentPath = `${DIST_DIR}/${component}`;
  
  if (existsSync(componentPath)) {
    const mainFile = getFileSize(`${componentPath}/index.esm.js`);
    
    if (mainFile.raw > 0) {
      console.log(`📦 ${component}:`);
      console.log(`   Raw: ${formatBytes(mainFile.raw)}`);
      console.log(`   Gzipped: ${formatBytes(mainFile.gzipped)}`);
      
      // Calculate percentage of main bundle
      const percentage = ((mainFile.gzipped / mainBundle.gzipped) * 100).toFixed(1);
      console.log(`   % of main bundle: ${percentage}%`);
      
      // Check if under 5KB target
      const status = mainFile.gzipped < 5120 ? '✅' : '❌';
      console.log(`   Status: ${status} (${mainFile.gzipped < 5120 ? 'Under' : 'Over'} 5KB target)`);
      console.log('');
    }
  }
});

// Optimization summary
console.log('🎯 Optimization Benefits:');
console.log('='.repeat(50));

// Estimated savings for specific use cases
const buttonOnly = getFileSize(`${DIST_DIR}/Button/index.esm.js`);
const listOnly = getFileSize(`${DIST_DIR}/List/index.esm.js`);
const paginationOnly = getFileSize(`${DIST_DIR}/Pagination/index.esm.js`);

if (buttonOnly.gzipped > 0) {
  const buttonSavings = mainBundle.gzipped - buttonOnly.gzipped;
  const buttonSavingsPercent = ((buttonSavings / mainBundle.gzipped) * 100).toFixed(1);
  console.log(`💡 Button-only app: ${formatBytes(buttonSavings)} savings (${buttonSavingsPercent}%)`);
}

if (listOnly.gzipped > 0) {
  const listSavings = mainBundle.gzipped - listOnly.gzipped;
  const listSavingsPercent = ((listSavings / mainBundle.gzipped) * 100).toFixed(1);
  console.log(`💡 List-only app: ${formatBytes(listSavings)} savings (${listSavingsPercent}%)`);
}

if (paginationOnly.gzipped > 0) {
  const paginationSavings = mainBundle.gzipped - paginationOnly.gzipped;
  const paginationSavingsPercent = ((paginationSavings / mainBundle.gzipped) * 100).toFixed(1);
  console.log(`💡 Pagination-only app: ${formatBytes(paginationSavings)} savings (${paginationSavingsPercent}%)`);
}

console.log('\n🎉 Tree-shaking allows importing only what you need!');
console.log('   Import individual components for maximum optimization.');

export { getFileSize, formatBytes };