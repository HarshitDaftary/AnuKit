#!/usr/bin/env node

/**
 * Debug Final Test Failure
 * Find the exact test that's failing
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';
const STYLES_DIR = './packages/styles/src';

const COMPONENT_CATEGORIES = {
  layout: ['Grid', 'Flex', 'Container', 'Stack'],
  forms: ['Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch'],
  navigation: ['Tabs', 'Menu', 'Breadcrumb'],
  dataDisplay: ['Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider'],
  feedback: ['Progress', 'Spinner'],
  overlay: ['Modal', 'Tooltip'],
  button: ['Button']
};

console.log('🔍 Debug Final Test Failure\n');

let totalTestsPassed = 0;
let totalTestsExpected = 0;

// Component structure tests (4 per component)
let componentTestsPassed = 0;
let componentTestsExpected = 0;

Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  components.forEach(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // 4 tests per component
      const hasForwardRef = content.includes('forwardRef');
      const hasInterface = content.includes(`${component}Props`);
      const hasExport = content.includes(`export { ${component} }`) || 
                       content.includes(`export { ${component},`) ||
                       content.includes(`, ${component} }`) ||
                       content.includes(`, ${component},`);
      const hasDisplayName = content.includes(`${component}.displayName`);
      
      const tests = [
        { name: 'forwardRef', passed: hasForwardRef },
        { name: 'interface', passed: hasInterface },
        { name: 'export', passed: hasExport },
        { name: 'displayName', passed: hasDisplayName }
      ];
      
      tests.forEach(test => {
        componentTestsExpected++;
        if (test.passed) {
          componentTestsPassed++;
        } else {
          console.log(`❌ ${component}.${test.name}: FAILED`);
        }
      });
    }
  });
});

console.log(`Component Tests: ${componentTestsPassed}/${componentTestsExpected}`);
totalTestsPassed += componentTestsPassed;
totalTestsExpected += componentTestsExpected;

// CSS file tests (1 per category)
let cssTestsPassed = 0;
let cssTestsExpected = 0;

const categoryCSS = {
  layout: 'layout.css',
  forms: 'forms.css',
  navigation: 'navigation.css',
  dataDisplay: 'data-display.css',
  feedback: 'feedback.css',
  overlay: 'overlay.css',
  button: 'button.css'
};

Object.entries(categoryCSS).forEach(([category, cssFile]) => {
  cssTestsExpected++;
  const cssPath = path.join(STYLES_DIR, cssFile);
  
  if (fs.existsSync(cssPath)) {
    cssTestsPassed++;
  } else {
    console.log(`❌ CSS file missing: ${cssFile}`);
  }
});

console.log(`CSS File Tests: ${cssTestsPassed}/${cssTestsExpected}`);
totalTestsPassed += cssTestsPassed;
totalTestsExpected += cssTestsExpected;

// Export tests (1 per component)
let exportTestsPassed = 0;
let exportTestsExpected = 0;

const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  Object.values(COMPONENT_CATEGORIES).flat().forEach(component => {
    exportTestsExpected++;
    const hasTypeExport = indexContent.includes(`${component}Props`);
    const hasComponentExport = indexContent.includes(`export { ${component} }`) || 
                               indexContent.includes(`export { ${component},`) ||
                               indexContent.includes(`, ${component} }`) ||
                               indexContent.includes(`, ${component},`);
    
    if (hasTypeExport && hasComponentExport) {
      exportTestsPassed++;
    } else {
      console.log(`❌ Export test failed for ${component}: type=${hasTypeExport}, component=${hasComponentExport}`);
    }
  });
}

console.log(`Export Tests: ${exportTestsPassed}/${exportTestsExpected}`);
totalTestsPassed += exportTestsPassed;
totalTestsExpected += exportTestsExpected;

// CSS integration tests (1 per CSS file)
let cssIntegrationTestsPassed = 0;
let cssIntegrationTestsExpected = 0;

const stylesIndexPath = path.join(STYLES_DIR, 'index.css');
if (fs.existsSync(stylesIndexPath)) {
  const indexContent = fs.readFileSync(stylesIndexPath, 'utf8');
  
  const expectedImports = [
    './variables.css',
    './layout.css',
    './forms.css',
    './navigation.css',
    './data-display.css',
    './feedback.css',
    './overlay.css',
    './button.css'
  ];
  
  expectedImports.forEach(importPath => {
    cssIntegrationTestsExpected++;
    if (indexContent.includes(`@import '${importPath}'`)) {
      cssIntegrationTestsPassed++;
    } else {
      console.log(`❌ CSS integration test failed: missing import ${importPath}`);
    }
  });
}

console.log(`CSS Integration Tests: ${cssIntegrationTestsPassed}/${cssIntegrationTestsExpected}`);
totalTestsPassed += cssIntegrationTestsPassed;
totalTestsExpected += cssIntegrationTestsExpected;

console.log(`\n🎯 Final Result:`);
console.log(`Total Tests Passed: ${totalTestsPassed}/${totalTestsExpected}`);
console.log(`Success Rate: ${Math.round((totalTestsPassed / totalTestsExpected) * 100)}%`);

if (totalTestsPassed === totalTestsExpected) {
  console.log('🎉 ALL TESTS PASS!');
} else {
  console.log(`❌ ${totalTestsExpected - totalTestsPassed} test(s) still failing`);
}