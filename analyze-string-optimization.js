#!/usr/bin/env node

/**
 * String Optimization Analysis
 * Analyze potential bundle size savings from string formatting pattern
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

console.log('📊 String Optimization Analysis\n');

let totalStringOccurrences = 0;
let totalCharacterSavings = 0;
let optimizedComponents = 0;
let totalComponents = 0;

Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  console.log(`📂 ${category.toUpperCase()}`);
  
  components.forEach(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    
    if (fs.existsSync(componentPath)) {
      totalComponents++;
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // Check if already optimized (has l_prx)
      const hasOptimization = content.includes('l_prx');
      if (hasOptimization) {
        optimizedComponents++;
      }
      
      // Count occurrences of hardcoded strings
      const componentPrefix = `optimui-${component.toLowerCase()}`;
      const occurrences = (content.match(new RegExp(`['"]${componentPrefix}[^'"]*['"]`, 'g')) || []).length;
      
      if (occurrences > 0) {
        const avgSavings = Math.round((componentPrefix.length - 6) * occurrences); // 6 chars for ${l_prx}
        totalStringOccurrences += occurrences;
        totalCharacterSavings += avgSavings;
        
        console.log(`  ${hasOptimization ? '✅' : '⚠️ '} ${component}: ${occurrences} strings, ~${avgSavings} chars saved`);
      } else {
        console.log(`  ${hasOptimization ? '✅' : '⚠️ '} ${component}: No hardcoded strings found`);
      }
    }
  });
  
  console.log();
});

console.log('📊 Summary');
console.log('==========');
console.log(`Total Components: ${totalComponents}`);
console.log(`Optimized Components: ${optimizedComponents}`);
console.log(`Remaining Components: ${totalComponents - optimizedComponents}`);
console.log(`Total String Occurrences: ${totalStringOccurrences}`);
console.log(`Estimated Character Savings: ${totalCharacterSavings}`);
console.log(`Estimated Bundle Reduction: ${Math.round(totalCharacterSavings / 1024 * 100) / 100}KB`);

console.log('\n💡 Optimization Status:');
const optimizationPercentage = Math.round((optimizedComponents / totalComponents) * 100);
console.log(`${optimizationPercentage}% components optimized`);

if (optimizationPercentage < 100) {
  console.log(`\n🚀 Remaining Work:`);
  console.log(`- Apply l_prx pattern to ${totalComponents - optimizedComponents} more components`);
  console.log(`- Update ${totalStringOccurrences} hardcoded class names`);
  console.log(`- Potential savings: ~${Math.round(totalCharacterSavings / 1024 * 100) / 100}KB`);
} else {
  console.log('\n🎉 All components optimized!');
}