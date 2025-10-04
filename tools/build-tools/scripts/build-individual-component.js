#!/usr/bin/env node

/**
 * Build Individual Component Script
 * Builds a single component and generates a failure report if needed
 * 
 * Usage: node build-individual-component.js <component-name>
 */

import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { swc } from 'rollup-plugin-swc3';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const componentName = process.argv[2];

if (!componentName) {
  console.error('❌ Error: Component name is required');
  console.error('Usage: node build-individual-component.js <component-name>');
  process.exit(1);
}

const componentsDir = '../../packages/components';
const componentPath = join(componentsDir, 'src', componentName);
const distPath = join(componentsDir, 'dist', componentName);
const reportsDir = join(componentsDir, 'build-reports');

// Check if component exists
if (!existsSync(componentPath)) {
  console.error(`❌ Error: Component "${componentName}" not found at ${componentPath}`);
  process.exit(1);
}

console.log(`\n🏗️  Building component: ${componentName}\n`);

// Create output directories
mkdirSync(distPath, { recursive: true });
mkdirSync(reportsDir, { recursive: true });

// Rollup configuration
const inputOptions = {
  input: join(componentsDir, 'src', componentName, 'index.ts'),
  external: ['react', 'react-dom', 'react/jsx-runtime', '@anukit/core', '@anukit/utils'],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    typescript({
      tsconfig: join(componentsDir, 'tsconfig.json'),
      declaration: true,
      declarationDir: distPath,
      rootDir: join(componentsDir, 'src'),
      include: [join(componentsDir, 'src', componentName, '**/*')]
    }),
    swc({
      jsc: {
        target: 'es2018',
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: false,
          dynamicImport: true
        },
        transform: {
          react: {
            runtime: 'automatic',
            refresh: false,
            development: false
          }
        }
      }
    })
  ],
  treeshake: {
    moduleSideEffects: false
  }
};

const outputOptions = [
  {
    file: join(distPath, 'index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  {
    file: join(distPath, 'index.esm.js'),
    format: 'esm',
    sourcemap: true
  }
];

async function build() {
  const startTime = Date.now();
  const buildLog = [];
  
  try {
    // Create rollup bundle
    const bundle = await rollup(inputOptions);
    
    // Write outputs
    for (const outputOption of outputOptions) {
      await bundle.write(outputOption);
      const message = `✅ Generated ${outputOption.format} bundle: ${outputOption.file}`;
      console.log(message);
      buildLog.push(message);
    }
    
    await bundle.close();
    
    const buildTime = Date.now() - startTime;
    const successMessage = `\n✅ Successfully built ${componentName} in ${buildTime}ms`;
    console.log(successMessage);
    buildLog.push(successMessage);
    
    // Generate success report
    const report = {
      component: componentName,
      status: 'success',
      timestamp: new Date().toISOString(),
      buildTime: buildTime,
      buildLog: buildLog.join('\n')
    };
    
    writeFileSync(
      join(reportsDir, `${componentName}.json`),
      JSON.stringify(report, null, 2)
    );
    
    return 0;
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    console.error(`\n❌ Failed to build ${componentName}:`);
    console.error(errorMessage);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    // Generate failure report
    const report = {
      component: componentName,
      status: 'failure',
      timestamp: new Date().toISOString(),
      buildTime: Date.now() - startTime,
      error: {
        message: errorMessage,
        stack: error.stack,
        code: error.code,
        plugin: error.plugin,
        loc: error.loc,
        frame: error.frame
      },
      buildLog: buildLog.join('\n'),
      errorSummary: `Build failed for component ${componentName}: ${errorMessage}`
    };
    
    writeFileSync(
      join(reportsDir, `${componentName}.json`),
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📄 Failure report saved to: ${join(reportsDir, `${componentName}.json`)}`);
    
    return 1;
  }
}

build().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
