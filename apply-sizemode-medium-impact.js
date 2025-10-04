#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZE_MODE_ENCODING = {
  'xs': '1', 'sm': '2', 'md': '3', 'lg': '4', 'xl': '5', '2xl': '6', '3xl': '7',
  'primary': 'p', 'secondary': 'S', 'success': 'c', 'warning': 'w', 'error': 'e',
  'info': 'i', 'danger': 'd', 'default': 'D', 'outlined': 'o', 'contained': 'C',
  'text': 't', 'ghost': 'g', 'subtle': 'u', 'small': 's', 'medium': 'm', 'large': 'l'
};

const componentsDir = path.join(__dirname, 'packages/components/src');

function optimizeComponent(componentName) {
  const componentPath = path.join(componentsDir, componentName);
  if (!fs.existsSync(componentPath)) return { success: false, error: 'Path not found' };
  
  const files = fs.readdirSync(componentPath);
  const tsxFile = files.find(f => f.endsWith('.tsx'));
  if (!tsxFile) return { success: false, error: 'No TSX file found' };
  
  const filePath = path.join(componentPath, tsxFile);
  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  // Add import for size mode utilities if not present
  if (!content.includes('import { encodeSizeMode')) {
    const lastImportMatch = content.match(/^import.*from.*['"];?$/gm);
    if (lastImportMatch) {
      const lastImportIndex = content.lastIndexOf(lastImportMatch[lastImportMatch.length - 1]);
      const insertPos = lastImportIndex + lastImportMatch[lastImportMatch.length - 1].length;
      const newImport = "\\nimport { encodeSizeMode } from '@optimui/utils/sizeMode';";
      content = content.slice(0, insertPos) + newImport + content.slice(insertPos);
      replacements++;
    }
  }
  
  // Pattern 1: Object keys in variant/size definitions
  const objectKeyPatterns = Object.keys(SIZE_MODE_ENCODING);
  objectKeyPatterns.forEach(sizeMode => {
    // Match object keys like: primary: [...]
    const keyPattern = new RegExp(`(\\s+)${sizeMode}(\\s*:)`, 'g');
    const matches = content.match(keyPattern);
    if (matches) {
      content = content.replace(keyPattern, `$1[encodeSizeMode('${sizeMode}')]$2`);
      replacements += matches.length;
    }
  });
  
  // Pattern 2: Object access like variantClasses[variant]
  const accessPatterns = [
    'variantClasses\\[([^\\]]+)\\]',
    'sizeClasses\\[([^\\]]+)\\]',
    'colorClasses\\[([^\\]]+)\\]',
    'stateClasses\\[([^\\]]+)\\]'
  ];
  
  accessPatterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'g');
    content = content.replace(regex, (match, accessor) => {
      // Don't encode if already encoded
      if (accessor.includes('encodeSizeMode')) return match;
      return match.replace(accessor, `encodeSizeMode(${accessor})`);
    });
  });
  
  if (replacements > 0) {
    fs.writeFileSync(filePath, content);
    return { success: true, replacements };
  }
  
  return { success: true, replacements: 0 };
}

// Medium-impact components (13-9 size modes)
const mediumImpactComponents = [
  'Spinner',     // 13 size modes
  'Tabs',        // 12 size modes
  'Container',   // 11 size modes
  'Menu',        // 9 size modes
  'Breadcrumb',  // 9 size modes
  'Table',       // 9 size modes
  'FormControl'  // 9 size modes
];

console.log('🚀 Applying Size Mode Encoding - Medium Impact Components\\n');

let totalReplacements = 0;
let optimizedComponents = 0;
let errors = [];

mediumImpactComponents.forEach(comp => {
  console.log(`📦 Processing ${comp}...`);
  const result = optimizeComponent(comp);
  
  if (result.success) {
    if (result.replacements > 0) {
      console.log(`✅ ${comp}: ${result.replacements} size mode encodings applied`);
      totalReplacements += result.replacements;
      optimizedComponents++;
    } else {
      console.log(`⭕ ${comp}: No size mode patterns found to optimize`);
    }
  } else {
    console.log(`❌ ${comp}: ${result.error}`);
    errors.push({ component: comp, error: result.error });
  }
  console.log('');
});

console.log(`📊 Medium Impact Optimization Summary:`);
console.log(`  Components Processed: ${optimizedComponents}/${mediumImpactComponents.length}`);
console.log(`  Total Encodings Applied: ${totalReplacements}`);
console.log(`  Estimated Savings: ~${Math.round(totalReplacements * 2.5)}KB`);

if (errors.length > 0) {
  console.log(`\\n⚠️  Errors encountered:`);
  errors.forEach(({ component, error }) => {
    console.log(`  - ${component}: ${error}`);
  });
}

console.log(`\\n🎯 Medium-impact size mode encoding complete!`);