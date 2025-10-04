#!/usr/bin/env node

/**
 * Build All Components Script
 * Builds all components individually and generates a summary report
 * 
 * Usage: node build-all-components.js
 */

import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const componentsDir = join(process.cwd(), '../../packages/components');
const srcDir = join(componentsDir, 'src');
const reportsDir = join(componentsDir, 'build-reports');

// Get all component directories
function getComponents() {
  try {
    return readdirSync(srcDir)
      .filter(dir => {
        const fullPath = join(srcDir, dir);
        return statSync(fullPath).isDirectory() && dir !== '__tests__' && dir !== 'utils';
      })
      .sort();
  } catch (error) {
    console.error('Error reading components directory:', error);
    return [];
  }
}

// Build a single component
function buildComponent(componentName) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Building: ${componentName}`);
    console.log('='.repeat(60));
    
    const child = spawn('node', ['build-individual-component.js', componentName], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      resolve({
        component: componentName,
        exitCode: code,
        success: code === 0
      });
    });
    
    child.on('error', (error) => {
      console.error(`Error building ${componentName}:`, error);
      resolve({
        component: componentName,
        exitCode: 1,
        success: false,
        error: error.message
      });
    });
  });
}

// Main build function
async function buildAll() {
  console.log('\n🏗️  Building All Components Individually\n');
  
  const components = getComponents();
  
  if (components.length === 0) {
    console.error('❌ No components found');
    process.exit(1);
  }
  
  console.log(`Found ${components.length} components to build:`);
  console.log(components.join(', '));
  console.log('');
  
  mkdirSync(reportsDir, { recursive: true });
  
  const results = [];
  const startTime = Date.now();
  
  // Build components sequentially for clearer output
  for (const component of components) {
    const result = await buildComponent(component);
    results.push(result);
  }
  
  const totalTime = Date.now() - startTime;
  
  // Generate summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 BUILD SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\nTotal Components: ${components.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Components:');
    failed.forEach(f => console.log(`   - ${f.component}`));
  }
  
  // Aggregate reports
  const aggregatedReport = {
    workflow: 'Build All Components',
    timestamp: new Date().toISOString(),
    totalTime: totalTime,
    total_components: components.length,
    successful_components: successful.length,
    failed_components: failed.length,
    results: [],
    failures: []
  };
  
  // Read individual reports
  for (const component of components) {
    const reportPath = join(reportsDir, `${component}.json`);
    if (existsSync(reportPath)) {
      try {
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        aggregatedReport.results.push(report);
        
        if (report.status === 'failure') {
          aggregatedReport.failures.push(report);
        }
      } catch (error) {
        console.error(`Error reading report for ${component}:`, error.message);
      }
    }
  }
  
  // Save aggregated report
  const summaryPath = join(reportsDir, 'build-summary.json');
  writeFileSync(summaryPath, JSON.stringify(aggregatedReport, null, 2));
  
  console.log(`\n📄 Summary report saved to: ${summaryPath}`);
  
  if (failed.length > 0) {
    console.log('\n💡 Tip: Use GitHub Copilot to analyze the failure reports and suggest fixes.');
    console.log(`   Check individual reports in: ${reportsDir}`);
  }
  
  console.log('\n');
  
  // Exit with error if any component failed
  process.exit(failed.length > 0 ? 1 : 0);
}

buildAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
