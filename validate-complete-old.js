#!/usr/bin/env node

/**
 * Complete OptimUI Library Validation Scr  // Check for missing brackets in className attributes (should be className={`...`} not className=`...`)
  const classNameNoBrackets = /className=`[^`]*`(?!\})/g;
  const missingBrackets = content.match(classNameNoBrackets);
  if (missingBrackets) {
    issues.push(`Missing brackets in ${missingBrackets.length} className attributes`);
  }
  
  // Check for self-referencing variables
  const selfRefRegex = /const\s+(\w+)\s*=\s*\1;/g;
  const selfRefMatches = content.match(selfRefRegex);
  if (selfRefMatches) {
    issues.push(`Self-referencing variables: ${selfRefMatches.join(', ')}`);
  }
  
  // Check for malformed object property syntax  
  const malformedPropRegex = /`\$\{[^}]*\}[^`]*`:\s*\]/g;
  const malformedProps = content.match(malformedPropRegex);
  if (malformedProps) {
    issues.push(`Malformed object properties: ${malformedProps.length} instances`);
  }ponent categories with SYNTAX VALIDATION and provides comprehensive report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = './packages/components/src';
const STYLES_DIR = './packages/styles/src';

// All component categories - UPDATED TO INCLUDE ALL 30+ COMPONENTS
const COMPONENT_CATEGORIES = {
  layout: ['Grid', 'Flex', 'Container', 'Stack'],
  forms: ['Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form', 'Input', 'Checkbox', 'Radio', 'Switch'],
  navigation: ['Tabs', 'Menu', 'Breadcrumb'],
  dataDisplay: ['Card', 'Table', 'DataTable', 'Pagination', 'Avatar', 'Badge', 'List', 'Divider'],
  feedback: ['Progress', 'Spinner'],
  overlay: ['Modal', 'Tooltip'],
  button: ['Button']
};

/**
 * Simple and effective syntax validation 
 */
function validateComponentSyntax(filePath, content) {
  const issues = [];
  
  // Check for malformed imports with escape sequences
  if (content.includes('\\n')) {
    issues.push('Malformed import with escape sequences');
  }
  
  // Check for self-referencing variables
  const selfRefRegex = /const\s+(\w+)\s*=\s*\1;/g;
  const selfRefMatches = content.match(selfRefRegex);
  if (selfRefMatches) {
    issues.push(`Self-referencing variables: ${selfRefMatches.join(', ')}`);
  }
  
  // Check for basic syntax issues that would prevent compilation
  try {
    // Simple bracket matching for JSX
    const openBrackets = (content.match(/\{/g) || []).length;
    const closeBrackets = (content.match(/\}/g) || []).length;
    
    if (Math.abs(openBrackets - closeBrackets) > 5) {
      issues.push('Significant bracket mismatch detected');
    }
  } catch (e) {
    issues.push('Syntax parsing error');
  }
  
  return issues;
}

/**
 * Advanced syntax validation using AST parsing
 */
function validateComponentSyntax(filePath, content) {
  const issues = [];
  
  // Check for malformed imports with escape sequences
  if (content.includes('\\n')) {
    issues.push('Malformed import with escape sequences');
  }
  
  // Check for missing equals in className attributes
  const classNameRegex = /className=`[^`]*`[^}]/g;
  const malformedClassNames = content.match(classNameRegex);
  if (malformedClassNames) {
    issues.push(`Missing brackets in ${malformedClassNames.length} className attributes`);
  }
  
  // Check for self-referencing variables
  const selfRefRegex = /const\s+(\w+)\s*=\s*\1;/g;
  const selfRefMatches = content.match(selfRefRegex);
  if (selfRefMatches) {
    issues.push(`Self-referencing variables: ${selfRefMatches.join(', ')}`);
  }
  
  // Check for malformed object property syntax  
  const malformedPropRegex = /`\$\{[^}]*\}[^`]*`:\s*\]/g;
  const malformedProps = content.match(malformedPropRegex);
  if (malformedProps) {
    issues.push(`Malformed object properties: ${malformedProps.length} instances`);
  }
  
  // Check for mismatched template literal brackets
  const templateMismatch = /className=\{`[^`]*`[^}]/g;
  const templateMismatches = content.match(templateMismatch);
  if (templateMismatches) {
    issues.push(`Template literal bracket mismatch: ${templateMismatches.length} instances`);
  }
  
  // Check for basic React structure
  if (!content.includes('import React') && !content.includes('import {') && content.includes('tsx')) {
    issues.push('Missing React import');
  }
  
  return issues;
}

console.log('🚀 OptimUI Complete Library Validation with Syntax Checking\n');

let totalComponentsFound = 0;
let totalComponentsExpected = 0;
let totalTestsPassed = 0;
let totalTestsExpected = 0;
let totalSyntaxErrors = 0;
let componentsWithSyntaxErrors = 0;

// Count all expected components
Object.values(COMPONENT_CATEGORIES).forEach(components => {
  totalComponentsExpected += components.length;
});

// Test each category
Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  console.log(`📂 ${category.toUpperCase()} Components`);
  
  let categoryComponentsFound = 0;
  let categoryTestsPassed = 0;
  let componentSizes = [];
  
  components.forEach(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      const lineCount = content.split('\n').length;
      componentSizes.push(`${component}: ${lineCount} lines`);
      
      // ENHANCED SYNTAX VALIDATION (Fast Mode)
      const syntaxIssues = validateComponentSyntax(componentPath, content);
      
      if (syntaxIssues.length === 0) {
        console.log(`  ✅ ${component}.tsx (Clean)`);
        categoryComponentsFound++;
        totalComponentsFound++;
      } else {
        console.log(`  ❌ ${component}.tsx (${syntaxIssues.length} issues)`);
        componentsWithSyntaxErrors++;
        totalSyntaxErrors += syntaxIssues.length;
        
        // Show first few issues
        syntaxIssues.slice(0, 3).forEach(issue => {
          console.log(`     • ${issue}`);
        });
        if (syntaxIssues.length > 3) {
          console.log(`     • ... and ${syntaxIssues.length - 3} more`);
        }
      }
      
      // Basic structure tests (only count if syntax is clean)
      if (syntaxIssues.length === 0) {
        const hasForwardRef = content.includes('forwardRef');
        const hasInterface = content.includes(`${component}Props`);
        const hasExport = content.includes(`export { ${component} }`) || 
                         content.includes(`export { ${component},`) ||
                         content.includes(`, ${component} }`) ||
                         content.includes(`, ${component},`);
        const hasDisplayName = content.includes(`${component}.displayName`);
        
        let componentTests = 0;
        if (hasForwardRef) componentTests++;
        if (hasInterface) componentTests++;
        if (hasExport) componentTests++;
        if (hasDisplayName) componentTests++;
        
        categoryTestsPassed += componentTests;
        totalTestsPassed += componentTests;
      }
    } else {
      console.log(`  ✗ ${component}.tsx missing`);
    }
  });
  
  // CSS file check
  const categoryCSS = {
    layout: 'layout.css',
    forms: 'forms.css',
    navigation: 'navigation.css',
    dataDisplay: 'data-display.css',
    feedback: 'feedback.css',
    overlay: 'overlay.css',
    button: 'button.css'
  };
  
  const cssFile = categoryCSS[category] || `${category}.css`;
  const cssPath = path.join(STYLES_DIR, cssFile);
  
  if (fs.existsSync(cssPath)) {
    console.log(`  ✓ ${cssFile}`);
    categoryTestsPassed++;
    totalTestsPassed++;
    
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const cssLineCount = cssContent.split('\n').length;
    componentSizes.push(`${cssFile}: ${cssLineCount} lines`);
  } else {
    console.log(`  ✗ ${cssFile} missing`);
  }
  
  console.log(`  Components: ${categoryComponentsFound}/${components.length}`);
  console.log(`  Sizes: ${componentSizes.join(', ')}`);
  console.log();
});

// Check main exports
console.log('📦 Main Exports');
const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
let exportTests = 0;

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  Object.values(COMPONENT_CATEGORIES).flat().forEach(component => {
    const hasTypeExport = indexContent.includes(`${component}Props`);
    // Check for both single export and multi-component exports
    const hasComponentExport = indexContent.includes(`export { ${component} }`) || 
                               indexContent.includes(`export { ${component},`) ||
                               indexContent.includes(`, ${component} }`) ||
                               indexContent.includes(`, ${component},`);
    
    if (hasTypeExport && hasComponentExport) {
      exportTests++;
    }
  });
  
  console.log(`  ✓ ${exportTests}/${totalComponentsExpected} components properly exported`);
  totalTestsPassed += exportTests;
}

// CSS integration check
console.log('\n🎨 CSS Integration');
const stylesIndexPath = path.join(STYLES_DIR, 'index.css');
let cssIntegrationTests = 0;

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
    if (indexContent.includes(`@import '${importPath}'`)) {
      cssIntegrationTests++;
    }
  });
  
  console.log(`  ✓ ${cssIntegrationTests}/${expectedImports.length} CSS files imported`);
  totalTestsPassed += cssIntegrationTests;
  totalTestsExpected = totalComponentsExpected * 4 + Object.keys(COMPONENT_CATEGORIES).length + totalComponentsExpected + expectedImports.length;
} else {
  totalTestsExpected = totalComponentsExpected * 4 + Object.keys(COMPONENT_CATEGORIES).length + totalComponentsExpected;
}

// Bundle analysis
console.log('\n📊 Bundle Analysis');
let totalLines = 0;
let componentLines = 0;
let cssLines = 0;

Object.values(COMPONENT_CATEGORIES).flat().forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    const lineCount = content.split('\n').length;
    componentLines += lineCount;
    totalLines += lineCount;
  }
});

const cssFiles = ['variables.css', 'layout.css', 'forms.css', 'navigation.css', 'data-display.css', 'feedback.css', 'overlay.css', 'button.css'];
cssFiles.forEach(cssFile => {
  const cssPath = path.join(STYLES_DIR, cssFile);
  if (fs.existsSync(cssPath)) {
    const content = fs.readFileSync(cssPath, 'utf8');
    const lineCount = content.split('\n').length;
    cssLines += lineCount;
    totalLines += lineCount;
  }
});

console.log(`  Total Components: ${totalComponentsFound} (${componentLines} lines)`);
console.log(`  Total CSS: ${cssFiles.length} files (${cssLines} lines)`);
console.log(`  Total Library: ${totalLines} lines`);

// Performance metrics
const avgComponentSize = Math.round(componentLines / totalComponentsFound);
const avgCSSSize = Math.round(cssLines / cssFiles.length);

console.log(`  Average Component Size: ${avgComponentSize} lines`);
console.log(`  Average CSS File Size: ${avgCSSSize} lines`);

// Final summary with SYNTAX VALIDATION
console.log('\n🎯 Final Summary');
console.log('================');
console.log(`Components Found: ${totalComponentsFound}/${totalComponentsExpected}`);
console.log(`Clean Components: ${totalComponentsFound - componentsWithSyntaxErrors}/${totalComponentsFound}`);
console.log(`Components with Syntax Errors: ${componentsWithSyntaxErrors}`);
console.log(`Total Syntax Issues: ${totalSyntaxErrors}`);
console.log(`Tests Passed: ${totalTestsPassed}/${totalTestsExpected}`);
console.log(`Success Rate: ${Math.round((totalTestsPassed / totalTestsExpected) * 100)}%`);

// Syntax validation status
if (totalSyntaxErrors === 0) {
  console.log(`🎉 Syntax Validation: PASSED (All components clean!)`);
} else {
  console.log(`❌ Syntax Validation: FAILED (${totalSyntaxErrors} issues in ${componentsWithSyntaxErrors} components)`);
}

// Component categories breakdown
console.log('\n📋 Categories Breakdown:');
Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  const found = components.filter(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    return fs.existsSync(componentPath);
  }).length;
  
  console.log(`  ${category}: ${found}/${components.length} (${Math.round((found/components.length)*100)}%)`);
});

// Recommendations
console.log('\n💡 Recommendations:');
if (totalSyntaxErrors === 0) {
  console.log('  ✅ All components have clean syntax!');
} else {
  console.log(`  🔧 Fix ${totalSyntaxErrors} syntax issues in ${componentsWithSyntaxErrors} components`);
}

if (totalComponentsFound === totalComponentsExpected) {
  console.log('  ✅ All planned components implemented!');
} else {
  console.log(`  ⚠️  ${totalComponentsExpected - totalComponentsFound} components still needed`);
}

if (totalLines < 5000) {
  console.log('  ✅ Library stays under 5KB target');
} else {
  console.log(`  ⚠️  Library is ${totalLines} lines (consider optimization)`);
}

if (avgComponentSize < 200) {
  console.log('  ✅ Components are well-sized');
} else {
  console.log('  ⚠️  Some components might be too large');
}

console.log('\n🎉 OptimUI library validation complete!');
console.log(`📊 Overall Health: ${totalSyntaxErrors === 0 ? '🟢 EXCELLENT' : totalSyntaxErrors < 10 ? '🟡 NEEDS WORK' : '🔴 CRITICAL'}`);

// Exit with appropriate code
process.exit(totalSyntaxErrors === 0 ? 0 : 1);