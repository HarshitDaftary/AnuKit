#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'packages/components/src');

function analyzeOptimUIStrings(componentName) {
  const componentPath = path.join(componentsDir, componentName);
  if (!fs.existsSync(componentPath)) return null;
  
  const files = fs.readdirSync(componentPath);
  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  
  let results = [];
  
  tsxFiles.forEach(tsxFile => {
    const filePath = path.join(componentPath, tsxFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count "optimui" occurrences in various contexts
    const patterns = [
      /"optimui[^"]*"/g,  // "optimui-something"
      /'optimui[^']*'/g,  // 'optimui-something'
      /optimui-[\w-]+/g,  // optimui-button, optimui-card, etc.
    ];
    
    let totalMatches = 0;
    let contexts = [];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      totalMatches += matches.length;
      contexts.push(...matches);
    });
    
    if (totalMatches > 0) {
      results.push({
        file: tsxFile,
        matches: totalMatches,
        contexts: [...new Set(contexts)], // Remove duplicates
        potentialSavings: contexts.reduce((sum, str) => sum + (str.length - 1), 0) // Assuming 1-char replacement
      });
    }
  });
  
  return results.length > 0 ? { component: componentName, files: results } : null;
}

const components = [
  'Grid', 'Flex', 'Container', 'Stack',
  'Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch',
  'Tabs', 'Menu', 'Breadcrumb',
  'Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider',
  'Progress', 'Spinner',
  'Modal', 'Tooltip',
  'Button'
];

console.log('🔍 Analyzing "optimui" String Usage Across Components\n');

let totalComponents = 0;
let totalMatches = 0;
let totalSavings = 0;
let allContexts = new Set();

components.forEach(comp => {
  const analysis = analyzeOptimUIStrings(comp);
  if (analysis) {
    totalComponents++;
    console.log(`📦 ${comp}:`);
    
    analysis.files.forEach(fileData => {
      totalMatches += fileData.matches;
      totalSavings += fileData.potentialSavings;
      
      console.log(`  📄 ${fileData.file}: ${fileData.matches} "optimui" occurrences`);
      console.log(`     💾 Potential savings: ~${fileData.potentialSavings} chars`);
      
      fileData.contexts.forEach(ctx => allContexts.add(ctx));
      
      if (fileData.contexts.length <= 5) {
        console.log(`     🔤 Examples: ${fileData.contexts.slice(0, 3).join(', ')}`);
      } else {
        console.log(`     🔤 Examples: ${fileData.contexts.slice(0, 3).join(', ')} ... (+${fileData.contexts.length - 3} more)`);
      }
    });
    console.log('');
  }
});

console.log('📊 "optimui" String Optimization Analysis:');
console.log(`  Components with "optimui" strings: ${totalComponents}/30`);
console.log(`  Total "optimui" occurrences: ${totalMatches}`);
console.log(`  Potential character savings: ~${totalSavings}`);
console.log(`  Estimated bundle reduction: ~${(totalSavings / 1024).toFixed(2)}KB`);
console.log(`  Unique string patterns: ${allContexts.size}`);

console.log('\n💡 Optimization Strategy:');
console.log('  1. Replace "optimui" with ultra-short variable (e.g., "o")');
console.log('  2. Use template literals: `${o}-button` instead of "optimui-button"');
console.log('  3. Average savings per occurrence: ~6 characters');
console.log('  4. Total estimated reduction: ~' + (totalMatches * 6 / 1024).toFixed(2) + 'KB');

console.log('\n🎯 Proposed Implementation:');
console.log('  const o = "optimui";  // Ultra-short prefix variable');
console.log('  const l_prx = `${o}-button`;  // Dynamic prefix construction');
console.log('  className={`${l_prx}-${variant}`}  // Template usage');

console.log('\n🚀 This optimization could save an additional ~' + (totalMatches * 6 / 1024).toFixed(2) + 'KB!');
console.log('Combined with existing optimizations, total savings: ~' + ((totalMatches * 6 + 3420) / 1024).toFixed(2) + 'KB');

if (allContexts.size > 0) {
  console.log('\n📋 All Unique "optimui" Patterns Found:');
  const sortedContexts = Array.from(allContexts).sort();
  sortedContexts.slice(0, 20).forEach((ctx, i) => {
    console.log(`  ${i + 1}. ${ctx}`);
  });
  if (sortedContexts.length > 20) {
    console.log(`  ... and ${sortedContexts.length - 20} more patterns`);
  }
}