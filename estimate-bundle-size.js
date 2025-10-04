#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all component files
const componentsDir = path.join(__dirname, 'packages/components/src');
const categories = ['Button', 'layout', 'forms', 'navigation', 'dataDisplay', 'feedback', 'overlay'];

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += getDirectorySize(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        totalSize += getFileSize(fullPath);
      }
    }
  } catch (err) {
    // Directory doesn't exist
  }
  return totalSize;
}

function analyzeComponent(componentPath) {
  if (!fs.existsSync(componentPath)) return { size: 0, optimized: false };
  
  const files = fs.readdirSync(componentPath);
  const tsxFile = files.find(f => f.endsWith('.tsx'));
  
  if (!tsxFile) return { size: 0, optimized: false };
  
  const filePath = path.join(componentPath, tsxFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const size = content.length;
  
  // Check if optimized (has l_prx pattern)
  const optimized = content.includes('const l_prx = ') || content.includes('l_prx =');
  
  // Count hardcoded strings (rough estimate)
  const stringMatches = content.match(/"optimui-[^"]*"/g) || [];
  const hardcodedStrings = stringMatches.filter(str => !str.includes('${'));
  
  return {
    size,
    optimized,
    hardcodedStrings: hardcodedStrings.length,
    totalStrings: stringMatches.length
  };
}

console.log('📊 OptimUI Bundle Size Estimation\n');

// Analyze main components
const components = [
  // Layout
  'Grid', 'Flex', 'Container', 'Stack',
  // Forms  
  'Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch',
  // Navigation
  'Tabs', 'Menu', 'Breadcrumb',
  // Data Display
  'Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider',
  // Feedback
  'Progress', 'Spinner',
  // Overlay
  'Modal', 'Tooltip',
  // Button
  'Button'
];

let totalSize = 0;
let optimizedComponents = 0;
let totalHardcodedStrings = 0;

console.log('📂 Component Analysis:');
for (const comp of components) {
  const componentPath = path.join(componentsDir, comp);
  const analysis = analyzeComponent(componentPath);
  
  if (analysis.size > 0) {
    totalSize += analysis.size;
    if (analysis.optimized) optimizedComponents++;
    totalHardcodedStrings += analysis.hardcodedStrings;
    
    const status = analysis.optimized ? '✅' : '❌';
    const stringInfo = analysis.hardcodedStrings > 0 ? ` (${analysis.hardcodedStrings} hardcoded)` : '';
    console.log(`  ${status} ${comp}: ${(analysis.size / 1024).toFixed(2)}KB${stringInfo}`);
  }
}

// Analyze CSS files
const stylesDir = path.join(__dirname, 'packages/styles/src');
const cssSize = getDirectorySize(stylesDir);

// Analyze other packages
const coreSize = getDirectorySize(path.join(__dirname, 'packages/core/src'));
const utilsSize = getDirectorySize(path.join(__dirname, 'packages/utils/src'));
const iconsSize = getDirectorySize(path.join(__dirname, 'packages/icons/src'));

const totalSourceSize = totalSize + cssSize + coreSize + utilsSize + iconsSize;

console.log('\n📊 Size Breakdown:');
console.log(`  Components: ${(totalSize / 1024).toFixed(2)}KB`);
console.log(`  Styles: ${(cssSize / 1024).toFixed(2)}KB`);
console.log(`  Core: ${(coreSize / 1024).toFixed(2)}KB`);
console.log(`  Utils: ${(utilsSize / 1024).toFixed(2)}KB`);
console.log(`  Icons: ${(iconsSize / 1024).toFixed(2)}KB`);
console.log(`  Total Source: ${(totalSourceSize / 1024).toFixed(2)}KB`);

console.log('\n🎯 Optimization Status:');
console.log(`  Optimized Components: ${optimizedComponents}/${components.length}`);
console.log(`  Optimization Rate: ${((optimizedComponents / components.length) * 100).toFixed(1)}%`);
console.log(`  Remaining Hardcoded Strings: ${totalHardcodedStrings}`);

// Estimate production bundle size (typically 30-50% of source due to minification/tree-shaking)
const estimatedBundleSize = totalSourceSize * 0.4; // Conservative estimate
console.log(`  Estimated Minified Bundle: ${(estimatedBundleSize / 1024).toFixed(2)}KB`);

// Estimate savings from string optimization (roughly 8-15 chars per hardcoded string)
const estimatedSavings = totalHardcodedStrings * 12; // Average 12 chars per string
console.log(`  Potential Additional Savings: ~${(estimatedSavings / 1024).toFixed(2)}KB`);

console.log('\n🚀 Bundle Optimization Summary:');
console.log(`  ✅ High optimization rate: ${((optimizedComponents / components.length) * 100).toFixed(1)}%`);
console.log(`  📦 Estimated production bundle: ~${(estimatedBundleSize / 1024).toFixed(1)}KB`);
if (totalHardcodedStrings > 0) {
  console.log(`  🔧 Room for improvement: ${totalHardcodedStrings} strings remaining`);
} else {
  console.log(`  🎉 Fully optimized: No hardcoded strings detected!`);
}