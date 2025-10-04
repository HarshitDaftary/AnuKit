#!/usr/bin/env node

/**
 * Form Components Validation Script
 * Tests component structure, exports, and CSS integration
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';
const STYLES_DIR = './packages/styles/src';

// Expected form components
const FORM_COMPONENTS = ['Select', 'Textarea', 'FormControl'];

console.log('🔍 AnuKit Form Components Validation\n');

// Test 1: Check component files exist
console.log('✅ Test 1: Component Files');
let componentTestsPassed = 0;

FORM_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    console.log(`  ✓ ${component}.tsx exists`);
    componentTestsPassed++;
  } else {
    console.log(`  ✗ ${component}.tsx missing`);
  }
});

console.log(`  Result: ${componentTestsPassed}/${FORM_COMPONENTS.length} form components found\n`);

// Test 2: Check CSS files
console.log('✅ Test 2: Form CSS Files');
const formCssPath = path.join(STYLES_DIR, 'forms.css');
let cssTestsPassed = 0;

if (fs.existsSync(formCssPath)) {
  console.log(`  ✓ forms.css exists`);
  cssTestsPassed++;
} else {
  console.log(`  ✗ forms.css missing`);
}

console.log(`  Result: ${cssTestsPassed}/1 form CSS file found\n`);

// Test 3: Check component structure
console.log('✅ Test 3: Component Structure');
let structureTestsPassed = 0;

FORM_COMPONENTS.forEach(component => {
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

console.log(`  Result: ${structureTestsPassed}/${FORM_COMPONENTS.length} form components properly structured\n`);

// Test 4: Check index exports
console.log('✅ Test 4: Index Exports');
const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
let exportTestsPassed = 0;

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  FORM_COMPONENTS.forEach(component => {
    const hasTypeExport = indexContent.includes(`${component}Props`);
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

console.log(`  Result: ${exportTestsPassed}/${FORM_COMPONENTS.length} form components properly exported\n`);

// Test 5: Check form CSS utilities
console.log('✅ Test 5: Form CSS Utilities');
let cssUtilTestsPassed = 0;

if (fs.existsSync(formCssPath)) {
  const cssContent = fs.readFileSync(formCssPath, 'utf8');
  
  const expectedClasses = [
    'anukit-form-control',
    'anukit-select',
    'anukit-textarea',
    'anukit-form-error',
    'anukit-form-helper'
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
  console.log('  ✗ forms.css not found');
}

console.log(`  Result: ${cssUtilTestsPassed}/5 form CSS utility classes found\n`);

// Test 6: Check CSS import in index
console.log('✅ Test 6: CSS Import Integration');
const stylesIndexPath = path.join(STYLES_DIR, 'index.css');
let importTestsPassed = 0;

if (fs.existsSync(stylesIndexPath)) {
  const indexContent = fs.readFileSync(stylesIndexPath, 'utf8');
  
  if (indexContent.includes("@import './forms.css'")) {
    console.log(`  ✓ forms.css properly imported in styles index`);
    importTestsPassed++;
  } else {
    console.log(`  ✗ forms.css not imported in styles index`);
  }
} else {
  console.log('  ✗ styles/index.css not found');
}

console.log(`  Result: ${importTestsPassed}/1 CSS import test passed\n`);

// Summary
const totalTests = componentTestsPassed + cssTestsPassed + structureTestsPassed + exportTestsPassed + cssUtilTestsPassed + importTestsPassed;
const maxPossibleTests = FORM_COMPONENTS.length * 3 + 1 + 5 + 1; // 3 tests per component + CSS file + CSS utilities + import

console.log('📊 Form Components Validation Summary');
console.log('====================================');
console.log(`Total Tests Passed: ${totalTests}/${maxPossibleTests}`);
console.log(`Success Rate: ${Math.round((totalTests / maxPossibleTests) * 100)}%`);

if (totalTests === maxPossibleTests) {
  console.log('\n🎉 All form component tests passed! Components are ready for production.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the issues above.');
}

// Show component line counts
console.log('\n📏 Component Sizes:');
FORM_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    const lineCount = content.split('\n').length;
    console.log(`  ${component}: ${lineCount} lines`);
  }
});

if (fs.existsSync(formCssPath)) {
  const cssContent = fs.readFileSync(formCssPath, 'utf8');
  const cssLineCount = cssContent.split('\n').length;
  console.log(`  forms.css: ${cssLineCount} lines`);
}