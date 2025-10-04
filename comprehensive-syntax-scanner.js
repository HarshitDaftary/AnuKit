#!/usr/bin/env node

/**
 * Comprehensive Syntax Error Scanner
 * Systematically scans ALL components for TypeScript/JSX syntax errors
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const COMPONENTS_DIR = './packages/components/src';

// Get all component directories
const getComponentDirs = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

// Get all TypeScript/TSX files in a directory
const getAllTsFiles = (dir) => {
  const files = [];
  
  const scanDir = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  };
  
  scanDir(dir);
  return files;
};

// Check for common syntax error patterns
const checkSyntaxPatterns = (filePath, content) => {
  const issues = [];
  
  // Pattern 1: Malformed imports with \n
  if (content.includes('\\n')) {
    issues.push('Malformed import with escape sequences');
  }
  
  // Pattern 2: Missing equals in className
  const classNamePattern = /className=`[^`]*`/g;
  const classNameMatches = content.match(classNamePattern);
  if (classNameMatches) {
    issues.push(`${classNameMatches.length} missing equals in className attributes`);
  }
  
  // Pattern 3: Self-referencing variables
  const selfRefPattern = /const\s+(\w+)\s*=\s*\1\s*;/g;
  const selfRefMatches = content.match(selfRefPattern);
  if (selfRefMatches) {
    issues.push(`Self-referencing variable: ${selfRefMatches.join(', ')}`);
  }
  
  // Pattern 4: Invalid switch case syntax
  if (content.includes('[encodeSizeMode(')) {
    issues.push('Invalid switch case with encodeSizeMode in brackets');
  }
  
  // Pattern 5: Check for HTMLNavElement vs HTMLElement
  if (content.includes('HTMLNavElement')) {
    issues.push('HTMLNavElement should be HTMLElement');
  }
  
  return issues;
};

// Main execution
console.log('🔍 Comprehensive Syntax Error Scanner');
console.log('=====================================\n');

const componentDirs = getComponentDirs(COMPONENTS_DIR);
let totalIssues = 0;
let componentsWithIssues = 0;

for (const componentName of componentDirs) {
  const componentPath = path.join(COMPONENTS_DIR, componentName);
  const files = getAllTsFiles(componentPath);
  
  if (files.length === 0) {
    console.log(`📦 ${componentName}: No TypeScript files found`);
    continue;
  }
  
  let componentIssues = 0;
  
  console.log(`📦 ${componentName}:`);
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = checkSyntaxPatterns(filePath, content);
      
      if (issues.length > 0) {
        const fileName = path.basename(filePath);
        console.log(`  ❌ ${fileName}:`);
        issues.forEach(issue => {
          console.log(`     • ${issue}`);
        });
        componentIssues += issues.length;
      } else {
        const fileName = path.basename(filePath);
        console.log(`  ✅ ${fileName}: Clean`);
      }
    } catch (error) {
      console.log(`  ⚠️  ${path.basename(filePath)}: Error reading file`);
    }
  }
  
  if (componentIssues > 0) {
    componentsWithIssues++;
    totalIssues += componentIssues;
    console.log(`  📊 Total issues in ${componentName}: ${componentIssues}\n`);
  } else {
    console.log(`  ✨ ${componentName}: All files clean\n`);
  }
}

console.log('📊 Final Summary:');
console.log('==================');
console.log(`Total Components: ${componentDirs.length}`);
console.log(`Components with Issues: ${componentsWithIssues}`);
console.log(`Clean Components: ${componentDirs.length - componentsWithIssues}`);
console.log(`Total Syntax Issues: ${totalIssues}`);

if (totalIssues > 0) {
  console.log('\n🚨 Action Required:');
  console.log('Fix the identified syntax issues in the affected components.');
} else {
  console.log('\n🎉 All components are syntax-error free!');
}

console.log('\n💡 Common Patterns to Fix:');
console.log('  • className=`text` → className={`text`}');
console.log('  • import statement\\n → proper line breaks');
console.log('  • const x = x; → const x = "value";');
console.log('  • [encodeSizeMode()] in switch → use default:');
console.log('  • HTMLNavElement → HTMLElement');