#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'packages/components/src');

// Common size mode patterns to look for
const sizeModePatterns = [
  // Size variants
  /'xs'/g, /"xs"/g,
  /'sm'/g, /"sm"/g, 
  /'md'/g, /"md"/g,
  /'lg'/g, /"lg"/g,
  /'xl'/g, /"xl"/g,
  /'2xl'/g, /"2xl"/g,
  /'3xl'/g, /"3xl"/g,
  
  // Common variants
  /'small'/g, /"small"/g,
  /'medium'/g, /"medium"/g,
  /'large'/g, /"large"/g,
  
  // State variants
  /'primary'/g, /"primary"/g,
  /'secondary'/g, /"secondary"/g,
  /'success'/g, /"success"/g,
  /'warning'/g, /"warning"/g,
  /'error'/g, /"error"/g,
  /'info'/g, /"info"/g,
  /'danger'/g, /"danger"/g,
  
  // Color variants
  /'default'/g, /"default"/g,
  /'outlined'/g, /"outlined"/g,
  /'contained'/g, /"contained"/g,
  /'text'/g, /"text"/g,
  /'ghost'/g, /"ghost"/g,
  /'subtle'/g, /"subtle"/g,
];

const components = [
  'Grid', 'Flex', 'Container', 'Stack',
  'Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch',
  'Tabs', 'Menu', 'Breadcrumb',
  'Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider',
  'Progress', 'Spinner',
  'Modal', 'Tooltip',
  'Button'
];

function analyzeComponent(componentName) {
  const componentPath = path.join(componentsDir, componentName);
  if (!fs.existsSync(componentPath)) return null;
  
  const files = fs.readdirSync(componentPath);
  const tsxFile = files.find(f => f.endsWith('.tsx'));
  if (!tsxFile) return null;
  
  const filePath = path.join(componentPath, tsxFile);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const sizeModeMatches = {};
  let totalMatches = 0;
  let totalCharsSaved = 0;
  
  sizeModePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    if (matches.length > 0) {
      const key = pattern.source.replace(/['"]/g, '');
      sizeModeMatches[key] = (sizeModeMatches[key] || 0) + matches.length;
      totalMatches += matches.length;
      
      // Calculate potential savings (original length - encoded length)
      const originalLength = key.length;
      const encodedLength = 1; // Single character encoding
      totalCharsSaved += matches.length * (originalLength - encodedLength);
    }
  });
  
  return {
    component: componentName,
    sizeModeMatches,
    totalMatches,
    totalCharsSaved,
    fileSize: content.length
  };
}

console.log('🎯 Size Mode String Optimization Analysis\n');

let globalSizeModeCount = {};
let totalComponents = 0;
let totalMatches = 0;
let totalCharsSaved = 0;

console.log('📂 Component Analysis:');
components.forEach(comp => {
  const analysis = analyzeComponent(comp);
  if (analysis) {
    totalComponents++;
    totalMatches += analysis.totalMatches;
    totalCharsSaved += analysis.totalCharsSaved;
    
    // Aggregate global counts
    Object.keys(analysis.sizeModeMatches).forEach(key => {
      globalSizeModeCount[key] = (globalSizeModeCount[key] || 0) + analysis.sizeModeMatches[key];
    });
    
    if (analysis.totalMatches > 0) {
      console.log(`  ✅ ${comp}: ${analysis.totalMatches} size modes (~${analysis.totalCharsSaved} chars saved)`);
      
      // Show top patterns for this component
      const topPatterns = Object.entries(analysis.sizeModeMatches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      if (topPatterns.length > 0) {
        const patternsStr = topPatterns.map(([key, count]) => `${key}:${count}`).join(', ');
        console.log(`     📊 Top patterns: ${patternsStr}`);
      }
    } else {
      console.log(`  ⭕ ${comp}: No size mode patterns found`);
    }
  }
});

console.log('\n📊 Global Size Mode Analysis:');
const sortedSizeModes = Object.entries(globalSizeModeCount)
  .sort((a, b) => b[1] - a[1]);

console.log('\n🏆 Most Common Size Modes:');
sortedSizeModes.slice(0, 10).forEach(([mode, count], index) => {
  const savings = count * (mode.length - 1); // Assuming 1-char encoding
  console.log(`  ${index + 1}. "${mode}": ${count} occurrences (~${savings} chars saved)`);
});

console.log('\n💡 Encoding Strategy Recommendations:');

// Propose encoding mappings
const encodingMap = {
  // Size variants (most common)
  'xs': '1',
  'sm': '2', 
  'md': '3',
  'lg': '4',
  'xl': '5',
  '2xl': '6',
  '3xl': '7',
  
  // Common variants
  'small': 's',
  'medium': 'm',
  'large': 'l',
  
  // State variants
  'primary': 'p',
  'secondary': 'S',
  'success': 'c',
  'warning': 'w',
  'error': 'e',
  'info': 'i',
  'danger': 'd',
  
  // Style variants
  'default': 'D',
  'outlined': 'o',
  'contained': 'C',
  'text': 't',
  'ghost': 'g',
  'subtle': 'u',
};

console.log('\n🔢 Proposed Encoding Map:');
Object.entries(encodingMap).forEach(([original, encoded]) => {
  const count = globalSizeModeCount[original] || 0;
  const savings = count * (original.length - encoded.length);
  if (count > 0) {
    console.log(`  "${original}" → "${encoded}" (${count} uses, ~${savings} chars saved)`);
  }
});

// Calculate total potential savings
let totalEncodingSavings = 0;
Object.entries(encodingMap).forEach(([original, encoded]) => {
  const count = globalSizeModeCount[original] || 0;
  totalEncodingSavings += count * (original.length - encoded.length);
});

console.log('\n📈 Size Mode Optimization Summary:');
console.log(`  Total Components Analyzed: ${totalComponents}`);
console.log(`  Total Size Mode Occurrences: ${totalMatches}`);
console.log(`  Potential Character Savings: ~${totalCharsSaved}`);
console.log(`  With Encoding Strategy: ~${totalEncodingSavings} chars`);
console.log(`  Estimated Bundle Reduction: ~${(totalEncodingSavings / 1024).toFixed(2)}KB`);

if (totalEncodingSavings > 0) {
  console.log('\n🚀 Implementation Approach:');
  console.log('  1. Create size mode encoding constants');
  console.log('  2. Replace string literals with encoded versions');
  console.log('  3. Add decoding logic for class name generation');
  console.log('  4. Maintain backward compatibility with props');
  
  console.log('\n💡 Next Steps:');
  console.log('  • Implement encoding constants in utils package');
  console.log('  • Update components with highest size mode usage first');
  console.log('  • Create automated migration script');
  console.log('  • Validate no breaking changes in prop interfaces');
}

console.log(`\n🎯 This optimization could save an additional ~${(totalEncodingSavings / 1024).toFixed(2)}KB!`);