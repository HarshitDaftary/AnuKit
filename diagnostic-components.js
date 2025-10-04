#!/usr/bin/env node

/**
 * Detailed Component Structure Analysis
 * Find which specific tests are failing
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';

const COMPONENT_CATEGORIES = {
  layout: ['Grid', 'Flex', 'Container', 'Stack'],
  forms: ['Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch'],
  navigation: ['Tabs', 'Menu', 'Breadcrumb'],
  dataDisplay: ['Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider'],
  feedback: ['Progress', 'Spinner'],
  overlay: ['Modal', 'Tooltip'],
  button: ['Button']
};

console.log('🔍 Detailed Component Structure Analysis\n');

let failedTests = [];
let totalComponentsAnalyzed = 0;

Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  console.log(`📂 ${category.toUpperCase()}`);
  
  components.forEach(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    
    if (fs.existsSync(componentPath)) {
      totalComponentsAnalyzed++;
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // Check component structure tests
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
      
      const failedForComponent = tests.filter(test => !test.passed);
      
      if (failedForComponent.length > 0) {
        console.log(`  ❌ ${component}: ${failedForComponent.map(t => t.name).join(', ')} FAILED`);
        failedTests.push(`${component}: ${failedForComponent.map(t => t.name).join(', ')}`);
      } else {
        console.log(`  ✅ ${component}: All tests passed`);
      }
    } else {
      console.log(`  ❌ ${component}: File missing`);
      failedTests.push(`${component}: File missing`);
    }
  });
  
  console.log();
});

console.log('📊 Summary');
console.log('==========');
console.log(`Components analyzed: ${totalComponentsAnalyzed}`);
console.log(`Failed tests: ${failedTests.length}`);

if (failedTests.length > 0) {
  console.log('\n🚨 Failed Tests:');
  failedTests.forEach(failure => {
    console.log(`  - ${failure}`);
  });
} else {
  console.log('\n🎉 All component structure tests passed!');
}