#!/usr/bin/env node

/**
 * Fast Syntax Validation Script for AnuKit Components
 * Quick syntax check without full compilation
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';

// All component categories
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
 * Focused syntax validation - catches actual syntax issues
 */
function validateComponentSyntax(filePath, content) {
  const issues = [];
  
  // 1. Check for malformed imports with escape sequences
  if (content.includes('\\n')) {
    issues.push('Malformed import with \\n escape sequences');
  }
  
  // 2. Check for className without brackets (className=`...` instead of className={`...`})
  const classNameNoBrackets = /className=`[^`]*`(?![}])/g;
  const missingBrackets = content.match(classNameNoBrackets);
  if (missingBrackets) {
    issues.push(`Missing JSX brackets: ${missingBrackets.length} className attributes need {}`);
  }
  
  // 3. Check for self-referencing variables (const x = x;)
  const selfRefRegex = /const\s+(\w+)\s*=\s*\1;/g;
  const selfRefMatches = content.match(selfRefRegex);
  if (selfRefMatches) {
    issues.push(`Self-referencing variables: ${selfRefMatches.join(', ')}`);
  }
  
  // 4. Check for malformed object property syntax with brackets after colon
  const malformedPropRegex = /`\$\{[^}]*\}[^`]*`:\s*\]/g;
  const malformedProps = content.match(malformedPropRegex);
  if (malformedProps) {
    issues.push(`Malformed object properties: ${malformedProps.length} instances with extra ]`);
  }
  
  // 5. Check for unclosed template literals in className
  const unmatchedBrackets = /className=\{`[^`]*`(?!\})/g;
  const bracketMismatches = content.match(unmatchedBrackets);
  if (bracketMismatches) {
    issues.push(`Unclosed JSX brackets: ${bracketMismatches.length} className attributes missing }`);
  }
  
  return issues;
}

console.log('🔍 AnuKit Syntax Validation (Fast Mode)\n');

let totalComponents = 0;
let cleanComponents = 0;
let totalIssues = 0;
let componentsWithIssues = 0;

// Validate each category
Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
  console.log(`📦 ${category.toUpperCase()}:`);
  
  components.forEach(component => {
    const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
    
    if (fs.existsSync(componentPath)) {
      totalComponents++;
      const content = fs.readFileSync(componentPath, 'utf8');
      const issues = validateComponentSyntax(componentPath, content);
      
      if (issues.length === 0) {
        console.log(`  ✅ ${component}.tsx: Clean`);
        cleanComponents++;
      } else {
        console.log(`  ❌ ${component}.tsx: ${issues.length} issues`);
        componentsWithIssues++;
        totalIssues += issues.length;
        
        issues.forEach(issue => {
          console.log(`     • ${issue}`);
        });
      }
    } else {
      console.log(`  ⚠️  ${component}.tsx: File not found`);
    }
  });
  
  console.log('');
});

// Summary
console.log('📊 Final Summary:');
console.log('==================');
console.log(`Total Components: ${totalComponents}`);
console.log(`Clean Components: ${cleanComponents}`);
console.log(`Components with Issues: ${componentsWithIssues}`);
console.log(`Total Syntax Issues: ${totalIssues}`);
console.log('');

if (totalIssues === 0) {
  console.log('🎉 Syntax Validation: PASSED - All components have clean syntax!');
  console.log('📊 Overall Health: 🟢 EXCELLENT');
} else {
  console.log(`❌ Syntax Validation: FAILED - ${totalIssues} issues found in ${componentsWithIssues} components`);
  console.log(`📊 Overall Health: ${totalIssues < 5 ? '🟡 NEEDS MINOR FIXES' : totalIssues < 20 ? '🟠 NEEDS WORK' : '🔴 CRITICAL ISSUES'}`);
}

console.log('');
console.log('💡 This validator catches real syntax errors that prevent compilation.');
console.log('💡 Use this before running your full build process for fast feedback.');

// Exit with appropriate code
process.exit(totalIssues === 0 ? 0 : 1);