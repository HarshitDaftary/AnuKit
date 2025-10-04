#!/usr/bin/env node

/**
 * Analyze Build Report
 * Analyzes build failure reports and provides actionable insights
 * 
 * Usage: node analyze-report.js [path-to-report.json]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const reportPath = process.argv[2] || join(process.cwd(), '../../packages/components/build-reports/build-summary.json');

console.log('\n📊 Analyzing Build Report\n');

if (!existsSync(reportPath)) {
  console.error(`❌ Report not found: ${reportPath}`);
  console.error('\nUsage: node analyze-report.js [path-to-report.json]');
  console.error('\nIf no path is provided, looks for:');
  console.error('  ../../packages/components/build-reports/build-summary.json\n');
  process.exit(1);
}

try {
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  
  console.log('='.repeat(70));
  console.log('BUILD ANALYSIS REPORT');
  console.log('='.repeat(70));
  console.log('');
  
  // Basic statistics
  console.log('📈 Statistics:');
  console.log(`   Workflow: ${report.workflow || 'Unknown'}`);
  console.log(`   Timestamp: ${report.timestamp || 'Unknown'}`);
  console.log(`   Total Components: ${report.total_components || 0}`);
  console.log(`   Successful: ${report.successful_components || 0} ✅`);
  console.log(`   Failed: ${report.failed_components || 0} ❌`);
  
  if (report.totalTime) {
    console.log(`   Total Time: ${(report.totalTime / 1000).toFixed(2)}s`);
  }
  
  const successRate = report.total_components > 0 
    ? ((report.successful_components / report.total_components) * 100).toFixed(1)
    : 0;
  console.log(`   Success Rate: ${successRate}%`);
  console.log('');
  
  // Analyze failures
  if (report.failed_components > 0 && report.failures && report.failures.length > 0) {
    console.log('🔍 Failure Analysis:');
    console.log('');
    
    // Categorize errors
    const errorTypes = {};
    const errorMessages = {};
    
    report.failures.forEach(failure => {
      if (failure.error) {
        const errorCode = failure.error.code || 'UNKNOWN';
        const errorMessage = failure.error.message || 'Unknown error';
        
        if (!errorTypes[errorCode]) {
          errorTypes[errorCode] = [];
        }
        errorTypes[errorCode].push(failure.component);
        
        if (!errorMessages[errorMessage]) {
          errorMessages[errorMessage] = [];
        }
        errorMessages[errorMessage].push(failure.component);
      }
    });
    
    // Show error types
    console.log('   By Error Type:');
    Object.entries(errorTypes).forEach(([errorType, components]) => {
      console.log(`   - ${errorType}: ${components.length} component(s)`);
      components.forEach(comp => console.log(`     • ${comp}`));
    });
    console.log('');
    
    // Show most common errors
    console.log('   Most Common Errors:');
    const sortedErrors = Object.entries(errorMessages)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);
    
    sortedErrors.forEach(([message, components]) => {
      console.log(`   - "${message}"`);
      console.log(`     Affects ${components.length} component(s): ${components.join(', ')}`);
    });
    console.log('');
    
    // Failed components
    console.log('   Failed Components:');
    report.failures.forEach(failure => {
      console.log(`   - ${failure.component}`);
      if (failure.errorSummary) {
        console.log(`     ${failure.errorSummary}`);
      }
    });
    console.log('');
    
  } else if (report.failed_components === 0) {
    console.log('🎉 All components built successfully!\n');
  }
  
  // Recommendations
  console.log('💡 Recommendations:');
  console.log('');
  
  if (report.failed_components > 0) {
    console.log('   1. Review individual failure reports in build-reports/ directory');
    console.log('   2. Download the build-summary-report artifact from GitHub Actions');
    console.log('   3. Use GitHub Copilot to analyze and fix errors:');
    console.log('      @workspace Analyze this build report and suggest fixes:');
    console.log('      [paste the JSON content from the artifact]');
    console.log('');
    console.log('   4. Common fixes based on error types:');
    
    const errorTypes = {};
    if (report.failures) {
      report.failures.forEach(failure => {
        if (failure.error && failure.error.code) {
          errorTypes[failure.error.code] = true;
        }
      });
    }
    
    if (errorTypes.PARSE_ERROR) {
      console.log('      • PARSE_ERROR: Check for syntax errors, missing brackets, or incorrect TypeScript');
    }
    if (errorTypes.MODULE_NOT_FOUND) {
      console.log('      • MODULE_NOT_FOUND: Verify imports and dependencies, run pnpm install');
    }
    if (errorTypes.TYPE_ERROR) {
      console.log('      • TYPE_ERROR: Fix TypeScript type mismatches');
    }
    console.log('');
    console.log('   5. After fixing, rebuild failed components:');
    report.failures && report.failures.forEach(failure => {
      console.log(`      node build-individual-component.js ${failure.component}`);
    });
  } else {
    console.log('   ✅ No action needed - all components built successfully!');
    console.log('   Consider:');
    console.log('   - Running tests: pnpm test');
    console.log('   - Checking bundle sizes: pnpm size');
    console.log('   - Deploying to staging/production');
  }
  
  console.log('');
  console.log('='.repeat(70));
  console.log('');
  
  process.exit(report.failed_components > 0 ? 1 : 0);
  
} catch (error) {
  console.error('❌ Error analyzing report:', error.message);
  
  if (error instanceof SyntaxError) {
    console.error('\nThe file does not contain valid JSON.');
    console.error('Make sure the report was generated correctly.\n');
  }
  
  process.exit(1);
}
