#!/usr/bin/env node

/**
 * Apply String Optimization to All Components
 * Systematically apply l_prx pattern across all components
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_TO_OPTIMIZE = [
  'Grid', 'Flex', 'Container', 'Stack',
  'Select', 'Textarea', 'TextField', 'DatePicker', 'Form', 'Checkbox', 'Radio', 'Switch',
  'Tabs', 'Menu', 'Breadcrumb',
  'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider',
  'Progress', 'Spinner', 'Tooltip'
];

console.log('🚀 Applying String Optimization Pattern\n');

COMPONENTS_TO_OPTIMIZE.forEach(component => {
  const componentPath = `./packages/components/src/${component}/${component}.tsx`;
  
  if (fs.existsSync(componentPath)) {
    let content = fs.readFileSync(componentPath, 'utf8');
    
    // Skip if already optimized
    if (content.includes('l_prx')) {
      console.log(`  ✅ ${component}: Already optimized`);
      return;
    }
    
    const componentPrefix = `optimui-${component.toLowerCase()}`;
    const occurrences = (content.match(new RegExp(`['"]${componentPrefix}[^'"]*['"]`, 'g')) || []).length;
    
    if (occurrences > 0) {
      // Add l_prx constant after imports
      const importEndIndex = content.lastIndexOf("import");
      const nextLineIndex = content.indexOf('\n', importEndIndex);
      const beforeConstant = content.substring(0, nextLineIndex + 1);
      const afterConstant = content.substring(nextLineIndex + 1);
      
      content = beforeConstant + `\nconst l_prx = "${componentPrefix}";\n` + afterConstant;
      
      // Replace hardcoded strings with template literals
      const regex = new RegExp(`['"]${componentPrefix}([^'"]*)['"]`, 'g');
      content = content.replace(regex, (match, suffix) => {
        if (suffix === '') {
          return 'l_prx';
        } else {
          return '`${l_prx}' + suffix + '`';
        }
      });
      
      fs.writeFileSync(componentPath, content);
      console.log(`  ✅ ${component}: Optimized ${occurrences} strings`);
    } else {
      console.log(`  ⚠️  ${component}: No strings found to optimize`);
    }
  } else {
    console.log(`  ❌ ${component}: File not found`);
  }
});

console.log('\n🎉 String optimization complete!');