#!/usr/bin/env node

/**
 * Enhanced Component Syntax Validation Script
 * Validates components for syntax errors and common issues
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const COMPONENTS_DIR = './src';

console.log('🔍 Enhanced Component Syntax Validation\n');

const errors = [];
const warnings = [];
let filesChecked = 0;

function checkSyntaxIssues(filePath, content) {
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for corrupted template literals
    if (line.match(/\$\{\[?\^[}\]]\*\}/)) {
      errors.push(`${filePath}:${lineNum} - Corrupted template literal pattern found`);
    }
    
    // Check for missing closing braces in className
    if (line.match(/className=\{`[^`]*`$/)) {
      errors.push(`${filePath}:${lineNum} - Missing closing brace in className attribute`);
    }
    
    // Check for malformed switch cases
    if (line.match(/\[encodeSizeMode\(['"].*['"]\)\]:/)) {
      errors.push(`${filePath}:${lineNum} - Malformed switch case with encodeSizeMode`);
    }
    
    // Check for console.log
    if (line.match(/console\.log\(/)) {
      warnings.push(`${filePath}:${lineNum} - Found console.log`);
    }
    
    // Check for debugger
    if (line.match(/\bdebugger\b/)) {
      errors.push(`${filePath}:${lineNum} - Found debugger statement`);
    }
    
    // Check for var usage
    if (line.match(/\bvar\s+\w+/)) {
      warnings.push(`${filePath}:${lineNum} - Using 'var' instead of 'const' or 'let'`);
    }
    
    // Check for == instead of ===
    if (line.match(/[^=!<>]==[^=]/) && !line.includes('===')) {
      warnings.push(`${filePath}:${lineNum} - Using '==' instead of '==='`);
    }
  });
  
  // Note: Bracket counting is disabled as it produces false positives
  // with template literals and JSX. Use TypeScript compiler for accurate bracket matching.
  /*
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`${filePath} - Bracket mismatch: ${openBraces} opening vs ${closeBraces} closing`);
  }
  */
}

function walkDir(dir) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = readFileSync(filePath, 'utf8');
      checkSyntaxIssues(filePath, content);
      filesChecked++;
    }
  });
}

walkDir(COMPONENTS_DIR);

console.log(`📊 Validation Results:\n`);
console.log(`   Files Checked: ${filesChecked}`);
console.log(`   Errors: ${errors.length}`);
console.log(`   Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.slice(0, 10).forEach(e => console.log(`  ${e}`));
  if (errors.length > 10) {
    console.log(`  ... and ${errors.length - 10} more errors`);
  }
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.slice(0, 10).forEach(w => console.log(`  ${w}`));
  if (warnings.length > 10) {
    console.log(`  ... and ${warnings.length - 10} more warnings`);
  }
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ No syntax issues found! All components pass validation.\n');
} else if (errors.length === 0) {
  console.log('✅ No critical errors found!\n');
}

process.exit(errors.length > 0 ? 1 : 0);
