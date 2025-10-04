#!/usr/bin/env node

/**
 * Layout Components Validation Script
 * Tests component structure, exports, and CSS integration
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';
const STYLES_DIR = './packages/styles/src';

// Expected layout components
const LAYOUT_COMPONENTS = ['Grid', 'Flex', 'Container', 'Stack'];

console.log('🔍 AnuKit Layout Components Validation\n');

// Test 1: Check component files exist
console.log('✅ Test 1: Component Files');
let componentTestsPassed = 0;

LAYOUT_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    console.log(`  ✓ ${component}.tsx exists`);
    componentTestsPassed++;
  } else {
    console.log(`  ✗ ${component}.tsx missing`);
  }
});

console.log(`  Result: ${componentTestsPassed}/${LAYOUT_COMPONENTS.length} components found\n`);

// Test 2: Check CSS files
console.log('✅ Test 2: CSS Files');
const cssFiles = ['variables.css', 'layout.css', 'index.css'];
let cssTestsPassed = 0;

cssFiles.forEach(file => {
  const cssPath = path.join(STYLES_DIR, file);
  if (fs.existsSync(cssPath)) {
    console.log(`  ✓ ${file} exists`);
    cssTestsPassed++;
  } else {
    console.log(`  ✗ ${file} missing`);
  }
});

console.log(`  Result: ${cssTestsPassed}/${cssFiles.length} CSS files found\n`);

// Test 3: Check component structure
console.log('✅ Test 3: Component Structure');
let structureTestsPassed = 0;

LAYOUT_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check for required patterns
    const hasForwardRef = content.includes('forwardRef');
    const hasInterface = content.includes(`${component}Props`);
    const hasExport = content.includes(`export { ${component} }`);
    const hasDisplayName = content.includes(`${component}.displayName`);
    
    if (hasForwardRef && hasInterface && hasExport && hasDisplayName) {
      console.log(`  ✓ ${component} has proper structure`);
      structureTestsPassed++;
    } else {
      console.log(`  ✗ ${component} missing required patterns:`);
      if (!hasForwardRef) console.log(`    - forwardRef`);
      if (!hasInterface) console.log(`    - ${component}Props interface`);
      if (!hasExport) console.log(`    - export statement`);
      if (!hasDisplayName) console.log(`    - displayName`);
    }
  }
});

console.log(`  Result: ${structureTestsPassed}/${LAYOUT_COMPONENTS.length} components properly structured\n`);

// Test 4: Check index exports
console.log('✅ Test 4: Index Exports');
const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
let exportTestsPassed = 0;

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  LAYOUT_COMPONENTS.forEach(component => {
    const hasTypeExport = indexContent.includes(`export type { ${component}Props }`);
    const hasComponentExport = indexContent.includes(`export { ${component} }`);
    
    if (hasTypeExport && hasComponentExport) {
      console.log(`  ✓ ${component} properly exported`);
      exportTestsPassed++;
    } else {
      console.log(`  ✗ ${component} export issues:`);
      if (!hasTypeExport) console.log(`    - Missing type export`);
      if (!hasComponentExport) console.log(`    - Missing component export`);
    }
  });
} else {
  console.log('  ✗ index.ts not found');
}

console.log(`  Result: ${exportTestsPassed}/${LAYOUT_COMPONENTS.length} components properly exported\n`);

// Test 5: Check CSS utilities
console.log('✅ Test 5: CSS Utilities');
const layoutCssPath = path.join(STYLES_DIR, 'layout.css');
let cssUtilTestsPassed = 0;

if (fs.existsSync(layoutCssPath)) {
  const cssContent = fs.readFileSync(layoutCssPath, 'utf8');
  
  const expectedClasses = [
    'anukit-container',
    'anukit-grid',
    'anukit-flex',
    'anukit-stack'
  ];
  
  expectedClasses.forEach(className => {
    if (cssContent.includes(`.${className}`)) {
      console.log(`  ✓ .${className} utility class found`);
      cssUtilTestsPassed++;
    } else {
      console.log(`  ✗ .${className} utility class missing`);
    }
  });
} else {
  console.log('  ✗ layout.css not found');
}

console.log(`  Result: ${cssUtilTestsPassed}/4 CSS utility classes found\n`);

// Summary
const totalTests = componentTestsPassed + cssTestsPassed + structureTestsPassed + exportTestsPassed + cssUtilTestsPassed;
const maxPossibleTests = LAYOUT_COMPONENTS.length * 3 + cssFiles.length + 4; // 3 tests per component + CSS files + CSS utilities

console.log('📊 Validation Summary');
console.log('==================');
console.log(`Total Tests Passed: ${totalTests}/${maxPossibleTests}`);
console.log(`Success Rate: ${Math.round((totalTests / maxPossibleTests) * 100)}%`);

if (totalTests === maxPossibleTests) {
  console.log('\n🎉 All tests passed! Layout components are ready for production.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the issues above.');
}