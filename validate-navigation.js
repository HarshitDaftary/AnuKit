#!/usr/bin/env node

/**
 * Navigation Components Validation Script
 * Tests component structure, exports, and CSS integration
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';
const STYLES_DIR = './packages/styles/src';

// Expected navigation components
const NAVIGATION_COMPONENTS = ['Tabs', 'Menu', 'Breadcrumb'];

console.log('🔍 AnuKit Navigation Components Validation\n');

// Test 1: Check component files exist
console.log('✅ Test 1: Component Files');
let componentTestsPassed = 0;

NAVIGATION_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    console.log(`  ✓ ${component}.tsx exists`);
    componentTestsPassed++;
  } else {
    console.log(`  ✗ ${component}.tsx missing`);
  }
});

console.log(`  Result: ${componentTestsPassed}/${NAVIGATION_COMPONENTS.length} navigation components found\n`);

// Test 2: Check CSS files
console.log('✅ Test 2: Navigation CSS Files');
const navigationCssPath = path.join(STYLES_DIR, 'navigation.css');
let cssTestsPassed = 0;

if (fs.existsSync(navigationCssPath)) {
  console.log(`  ✓ navigation.css exists`);
  cssTestsPassed++;
} else {
  console.log(`  ✗ navigation.css missing`);
}

console.log(`  Result: ${cssTestsPassed}/1 navigation CSS file found\n`);

// Test 3: Check component structure
console.log('✅ Test 3: Component Structure');
let structureTestsPassed = 0;

NAVIGATION_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check for required patterns
    const hasForwardRef = content.includes('forwardRef');
    const hasInterface = content.includes(`${component}Props`);
    const hasExport = content.includes(`export { ${component} }`);
    const hasDisplayName = content.includes(`${component}.displayName`);
    const hasAriaAttributes = content.includes('aria-') || content.includes('role=');
    
    if (hasForwardRef && hasInterface && hasExport && hasDisplayName && hasAriaAttributes) {
      console.log(`  ✓ ${component} has proper structure`);
      structureTestsPassed++;
    } else {
      console.log(`  ✗ ${component} missing required patterns:`);
      if (!hasForwardRef) console.log(`    - forwardRef`);
      if (!hasInterface) console.log(`    - ${component}Props interface`);
      if (!hasExport) console.log(`    - export statement`);
      if (!hasDisplayName) console.log(`    - displayName`);
      if (!hasAriaAttributes) console.log(`    - ARIA attributes`);
    }
  }
});

console.log(`  Result: ${structureTestsPassed}/${NAVIGATION_COMPONENTS.length} navigation components properly structured\n`);

// Test 4: Check index exports
console.log('✅ Test 4: Index Exports');
const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
let exportTestsPassed = 0;

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  NAVIGATION_COMPONENTS.forEach(component => {
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

console.log(`  Result: ${exportTestsPassed}/${NAVIGATION_COMPONENTS.length} navigation components properly exported\n`);

// Test 5: Check navigation CSS utilities
console.log('✅ Test 5: Navigation CSS Utilities');
let cssUtilTestsPassed = 0;

if (fs.existsSync(navigationCssPath)) {
  const cssContent = fs.readFileSync(navigationCssPath, 'utf8');
  
  const expectedClasses = [
    'anukit-tabs',
    'anukit-tab',
    'anukit-menu',
    'anukit-menu-item',
    'anukit-breadcrumb',
    'anukit-breadcrumb-item'
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
  console.log('  ✗ navigation.css not found');
}

console.log(`  Result: ${cssUtilTestsPassed}/6 navigation CSS utility classes found\n`);

// Test 6: Check CSS import in index
console.log('✅ Test 6: CSS Import Integration');
const stylesIndexPath = path.join(STYLES_DIR, 'index.css');
let importTestsPassed = 0;

if (fs.existsSync(stylesIndexPath)) {
  const indexContent = fs.readFileSync(stylesIndexPath, 'utf8');
  
  if (indexContent.includes("@import './navigation.css'")) {
    console.log(`  ✓ navigation.css properly imported in styles index`);
    importTestsPassed++;
  } else {
    console.log(`  ✗ navigation.css not imported in styles index`);
  }
} else {
  console.log('  ✗ styles/index.css not found');
}

console.log(`  Result: ${importTestsPassed}/1 CSS import test passed\n`);

// Test 7: Check accessibility features
console.log('✅ Test 7: Accessibility Features');
let accessibilityTestsPassed = 0;

NAVIGATION_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    const hasKeyboardHandling = content.includes('onKeyDown') || content.includes('KeyDown');
    const hasFocusManagement = content.includes('focus') || content.includes('tabIndex');
    const hasAriaLabels = content.includes('aria-label') || content.includes('aria-labelledby');
    const hasRoles = content.includes('role=');
    
    if (hasKeyboardHandling && hasFocusManagement && hasAriaLabels && hasRoles) {
      console.log(`  ✓ ${component} has comprehensive accessibility`);
      accessibilityTestsPassed++;
    } else {
      console.log(`  ✗ ${component} missing accessibility features:`);
      if (!hasKeyboardHandling) console.log(`    - Keyboard handling`);
      if (!hasFocusManagement) console.log(`    - Focus management`);
      if (!hasAriaLabels) console.log(`    - ARIA labels`);
      if (!hasRoles) console.log(`    - ARIA roles`);
    }
  }
});

console.log(`  Result: ${accessibilityTestsPassed}/${NAVIGATION_COMPONENTS.length} components fully accessible\n`);

// Summary
const totalTests = componentTestsPassed + cssTestsPassed + structureTestsPassed + exportTestsPassed + cssUtilTestsPassed + importTestsPassed + accessibilityTestsPassed;
const maxPossibleTests = NAVIGATION_COMPONENTS.length * 4 + 1 + 6 + 1; // 4 tests per component + CSS file + CSS utilities + import + accessibility

console.log('📊 Navigation Components Validation Summary');
console.log('==========================================');
console.log(`Total Tests Passed: ${totalTests}/${maxPossibleTests}`);
console.log(`Success Rate: ${Math.round((totalTests / maxPossibleTests) * 100)}%`);

if (totalTests === maxPossibleTests) {
  console.log('\n🎉 All navigation component tests passed! Components are ready for production.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the issues above.');
}

// Show component line counts
console.log('\n📏 Component Sizes:');
NAVIGATION_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    const lineCount = content.split('\n').length;
    console.log(`  ${component}: ${lineCount} lines`);
  }
});

if (fs.existsSync(navigationCssPath)) {
  const cssContent = fs.readFileSync(navigationCssPath, 'utf8');
  const cssLineCount = cssContent.split('\n').length;
  console.log(`  navigation.css: ${cssLineCount} lines`);
}