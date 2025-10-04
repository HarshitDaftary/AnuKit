#!/usr/bin/env node

/**
 * Validate GitHub Actions Workflow Configuration
 * Checks the build-components.yml workflow for correctness
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const workflowPath = join(process.cwd(), '../../../.github/workflows/build-components.yml');

console.log('\n🔍 Validating GitHub Actions Workflow Configuration\n');

try {
  const content = readFileSync(workflowPath, 'utf8');
  
  const checks = [
    {
      name: 'Workflow name is defined',
      test: () => content.includes('name: Build Components Individually'),
      pass: true
    },
    {
      name: 'Has prepare job',
      test: () => content.includes('prepare:'),
      pass: true
    },
    {
      name: 'Has build-components job',
      test: () => content.includes('build-components:'),
      pass: true
    },
    {
      name: 'Has summarize-results job',
      test: () => content.includes('summarize-results:'),
      pass: true
    },
    {
      name: 'Uses matrix strategy',
      test: () => content.includes('matrix:') && content.includes('component:'),
      pass: true
    },
    {
      name: 'Has fail-fast: false',
      test: () => content.includes('fail-fast: false'),
      pass: true
    },
    {
      name: 'Uploads failure reports',
      test: () => content.includes('upload-artifact@v4'),
      pass: true
    },
    {
      name: 'Downloads failure reports',
      test: () => content.includes('download-artifact@v4'),
      pass: true
    },
    {
      name: 'Comments on PR',
      test: () => content.includes('actions/github-script@v7'),
      pass: true
    },
    {
      name: 'Triggers on push and pull_request',
      test: () => content.includes('push:') && content.includes('pull_request:'),
      pass: true
    },
    {
      name: 'Has workflow_dispatch',
      test: () => content.includes('workflow_dispatch:'),
      pass: true
    },
    {
      name: 'Installs pnpm',
      test: () => content.includes('npm install -g pnpm'),
      pass: true
    },
    {
      name: 'Creates rollup config dynamically',
      test: () => content.includes('rollup.config.component.js'),
      pass: true
    },
    {
      name: 'Generates JSON reports',
      test: () => content.includes('build-reports') && content.includes('.json'),
      pass: true
    },
    {
      name: 'Has continue-on-error',
      test: () => content.includes('continue-on-error: true'),
      pass: true
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  console.log('Running validation checks:\n');
  
  checks.forEach((check, index) => {
    const result = check.test();
    if (result) {
      console.log(`✅ ${index + 1}. ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${index + 1}. ${check.name}`);
      failed++;
    }
  });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('Validation Summary');
  console.log('='.repeat(60));
  console.log(`Total Checks: ${checks.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 All validation checks passed!');
    console.log('\nThe workflow is properly configured to:');
    console.log('  - Build all components individually');
    console.log('  - Continue on failures (fail-fast: false)');
    console.log('  - Generate JSON reports for failures');
    console.log('  - Upload reports as artifacts');
    console.log('  - Create a summary report');
    console.log('  - Comment on pull requests with results');
    console.log('  - Be consumable by GitHub Copilot for fixing issues\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some validation checks failed. Please review the workflow configuration.\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading workflow file:', error.message);
  console.error('\nMake sure you run this from tools/build-tools/scripts directory\n');
  process.exit(1);
}
