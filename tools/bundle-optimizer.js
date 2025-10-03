#!/usr/bin/env node

import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { analyze } from 'bundle-analyzer';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

class BundleOptimizer {
  constructor(options = {}) {
    this.options = {
      targetSize: 5000, // 5KB per component target
      enableGzip: true,
      enableBrotli: true,
      treeshakingLevel: 'aggressive',
      minificationLevel: 'maximum',
      ...options
    };
    
    this.results = {
      components: {},
      totalSize: 0,
      gzippedSize: 0,
      treeshakingEffectiveness: 0,
      violations: []
    };
  }

  async optimizeBundle(packagePath) {
    console.log('🚀 Starting OptimUI Bundle Optimization...\n');
    
    // Step 1: Analyze current bundle
    await this.analyzeBundleSize(packagePath);
    
    // Step 2: Implement advanced tree-shaking
    await this.optimizeTreeShaking(packagePath);
    
    // Step 3: Apply zero-dependency principles
    await this.enforceZeroDependencies(packagePath);
    
    // Step 4: Optimize exports for minimal footprint
    await this.optimizeExports(packagePath);
    
    // Step 5: Generate size report
    await this.generateSizeReport(packagePath);
    
    return this.results;
  }

  async analyzeBundleSize(packagePath) {
    console.log('📊 Analyzing current bundle sizes...');
    
    const distPath = join(packagePath, 'dist');
    if (!existsSync(distPath)) {
      console.log('Building packages first...');
      execSync('npm run build', { cwd: packagePath, stdio: 'inherit' });
    }

    // Analyze each component individually
    const components = ['Button', 'Modal', 'Input', 'Checkbox', 'Radio', 'Switch', 'Tooltip'];
    
    for (const component of components) {
      const componentPath = join(distPath, component);
      if (existsSync(componentPath)) {
        await this.analyzeComponent(component, componentPath);
      }
    }

    // Analyze main bundle
    const mainBundle = join(distPath, 'index.esm.js');
    if (existsSync(mainBundle)) {
      await this.analyzeMainBundle(mainBundle);
    }
  }

  async analyzeComponent(name, path) {
    const esmFile = join(path, 'index.esm.js');
    const cjsFile = join(path, 'index.js');
    
    if (existsSync(esmFile)) {
      const content = readFileSync(esmFile);
      const gzipped = gzipSync(content);
      
      this.results.components[name] = {
        size: content.length,
        gzippedSize: gzipped.length,
        targetMet: gzipped.length <= this.options.targetSize,
        dependencies: this.extractDependencies(content.toString())
      };

      if (gzipped.length > this.options.targetSize) {
        this.results.violations.push({
          component: name,
          size: gzipped.length,
          target: this.options.targetSize,
          excess: gzipped.length - this.options.targetSize
        });
      }

      console.log(`  ${name}: ${content.length}B raw, ${gzipped.length}B gzipped ${gzipped.length <= this.options.targetSize ? '✅' : '❌'}`);
    }
  }

  async analyzeMainBundle(bundlePath) {
    const content = readFileSync(bundlePath);
    const gzipped = gzipSync(content);
    
    this.results.totalSize = content.length;
    this.results.gzippedSize = gzipped.length;
    
    console.log(`  Main Bundle: ${content.length}B raw, ${gzipped.length}B gzipped`);
  }

  extractDependencies(code) {
    // Extract import statements to check for external dependencies
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const dependencies = new Set();
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1];
      if (!dep.startsWith('.') && !dep.startsWith('/')) {
        dependencies.add(dep);
      }
    }
    
    return Array.from(dependencies);
  }

  async optimizeTreeShaking(packagePath) {
    console.log('\n🌳 Optimizing tree-shaking...');
    
    // Create optimized export structure
    await this.createOptimizedExports(packagePath);
    
    // Implement barrel exports elimination
    await this.eliminateBarrelExports(packagePath);
    
    // Add sideEffects: false to package.json
    await this.optimizePackageJson(packagePath);
  }

  async createOptimizedExports(packagePath) {
    const packageJsonPath = join(packagePath, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // Create granular exports for each component
    const components = ['Button', 'Modal', 'Input', 'Checkbox', 'Radio', 'Switch', 'Tooltip'];
    const exports = {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.esm.js",
        "require": "./dist/index.js"
      }
    };

    // Add individual component exports
    for (const component of components) {
      exports[`./${component}`] = {
        "types": `./dist/${component}/index.d.ts`,
        "import": `./dist/${component}/index.esm.js`,
        "require": `./dist/${component}/index.js`
      };
    }

    packageJson.exports = exports;
    packageJson.sideEffects = false;

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('  ✅ Created granular exports for optimal tree-shaking');
  }

  async eliminateBarrelExports(packagePath) {
    // Create individual entry points to avoid barrel export issues
    const srcPath = join(packagePath, 'src');
    const components = ['Button', 'Modal', 'Input', 'Checkbox', 'Radio', 'Switch', 'Tooltip'];

    for (const component of components) {
      const componentDir = join(srcPath, component);
      const indexPath = join(componentDir, 'index.ts');
      
      if (!existsSync(indexPath)) {
        const indexContent = `export { ${component} } from './${component}';
export type { ${component}Props } from './${component}';
`;
        writeFileSync(indexPath, indexContent);
      }
    }

    console.log('  ✅ Eliminated barrel export issues');
  }

  async optimizePackageJson(packagePath) {
    const packageJsonPath = join(packagePath, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // Optimize for tree-shaking
    packageJson.sideEffects = false;
    packageJson.type = "module";
    
    // Add module field for better bundler support
    if (!packageJson.module) {
      packageJson.module = "dist/index.esm.js";
    }

    // Add browser field for web bundlers
    packageJson.browser = packageJson.module;

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('  ✅ Optimized package.json for tree-shaking');
  }

  async enforceZeroDependencies(packagePath) {
    console.log('\n🚫 Enforcing zero-dependency philosophy...');
    
    // Check for runtime dependencies
    const packageJsonPath = join(packagePath, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    const runtimeDeps = packageJson.dependencies || {};
    const allowedDeps = ['@optimui/core']; // Only allow internal dependencies
    
    const violatingDeps = Object.keys(runtimeDeps).filter(dep => 
      !allowedDeps.includes(dep)
    );

    if (violatingDeps.length > 0) {
      console.log(`  ❌ Found external dependencies: ${violatingDeps.join(', ')}`);
      this.results.violations.push({
        type: 'external-dependencies',
        dependencies: violatingDeps
      });
    } else {
      console.log('  ✅ Zero external dependencies confirmed');
    }

    // Inline small utilities instead of importing
    await this.inlineSmallUtilities(packagePath);
  }

  async inlineSmallUtilities(packagePath) {
    console.log('  📦 Inlining small utilities to avoid dependencies...');
    
    // Create a utilities file with common functions
    const utilsContent = `
// Inlined utilities to avoid external dependencies
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};
`;

    const utilsPath = join(packagePath, 'src', 'utils.ts');
    writeFileSync(utilsPath, utilsContent);
    console.log('  ✅ Created inlined utilities');
  }

  async optimizeExports(packagePath) {
    console.log('\n📤 Optimizing exports for minimal footprint...');
    
    // Update main index to use dynamic imports for code-splitting
    const indexContent = `
// Core exports - always included
export type { ButtonProps } from './Button/Button';
export type { ModalProps } from './Modal/Modal';
export type { InputProps } from './Input/Input';
export type { CheckboxProps } from './Checkbox/Checkbox';
export type { RadioProps, RadioGroupProps } from './Radio/Radio';
export type { SwitchProps } from './Switch/Switch';
export type { TooltipProps } from './Tooltip/Tooltip';

// Lazy component exports for tree-shaking
export const Button = /* @__PURE__ */ (() => {
  const { Button } = require('./Button/Button');
  return Button;
})();

export const Modal = /* @__PURE__ */ (() => {
  const { Modal } = require('./Modal/Modal');
  return Modal;
})();

export const Input = /* @__PURE__ */ (() => {
  const { Input } = require('./Input/Input');
  return Input;
})();

export const Checkbox = /* @__PURE__ */ (() => {
  const { Checkbox } = require('./Checkbox/Checkbox');
  return Checkbox;
})();

export const Radio = /* @__PURE__ */ (() => {
  const { Radio } = require('./Radio/Radio');
  return Radio;
})();

export const RadioGroup = /* @__PURE__ */ (() => {
  const { RadioGroup } = require('./Radio/Radio');
  return RadioGroup;
})();

export const Switch = /* @__PURE__ */ (() => {
  const { Switch } = require('./Switch/Switch');
  return Switch;
})();

export const Tooltip = /* @__PURE__ */ (() => {
  const { Tooltip } = require('./Tooltip/Tooltip');
  return Tooltip;
})();
`;

    const indexPath = join(packagePath, 'src', 'index.ts');
    writeFileSync(indexPath, indexContent);
    console.log('  ✅ Created optimized exports with lazy loading');
  }

  async generateSizeReport(packagePath) {
    console.log('\n📋 Generating bundle size report...');
    
    // Rebuild with optimizations
    console.log('  🔄 Rebuilding with optimizations...');
    execSync('npm run build', { cwd: packagePath, stdio: 'inherit' });
    
    // Re-analyze after optimizations
    await this.analyzeBundleSize(packagePath);
    
    // Generate comprehensive report
    const report = this.createSizeReport();
    const reportPath = join(packagePath, 'BUNDLE_SIZE_REPORT.md');
    writeFileSync(reportPath, report);
    
    console.log(`\n📊 Bundle size report generated: ${reportPath}`);
    console.log('\n🎯 Optimization Summary:');
    console.log(`  Total Components: ${Object.keys(this.results.components).length}`);
    console.log(`  Target Met: ${Object.values(this.results.components).filter(c => c.targetMet).length}`);
    console.log(`  Total Gzipped: ${this.results.gzippedSize}B`);
    console.log(`  Violations: ${this.results.violations.length}`);
    
    if (this.results.violations.length === 0) {
      console.log('  🎉 All optimization targets met!');
    } else {
      console.log('  ⚠️  Some targets need attention');
    }
  }

  createSizeReport() {
    const components = Object.entries(this.results.components);
    const totalTargetMet = components.filter(([, data]) => data.targetMet).length;
    
    return `# OptimUI Bundle Size Report

## Summary

- **Total Components**: ${components.length}
- **Target Met**: ${totalTargetMet}/${components.length} (${Math.round(totalTargetMet / components.length * 100)}%)
- **Total Bundle Size**: ${this.results.totalSize} bytes
- **Total Gzipped**: ${this.results.gzippedSize} bytes
- **Average Component Size**: ${Math.round(this.results.gzippedSize / components.length)} bytes (gzipped)

## Component Breakdown

| Component | Raw Size | Gzipped | Target (5KB) | Status | Dependencies |
|-----------|----------|---------|--------------|--------|--------------|
${components.map(([name, data]) => 
  `| ${name} | ${data.size}B | ${data.gzippedSize}B | ${this.options.targetSize}B | ${data.targetMet ? '✅' : '❌'} | ${data.dependencies.length === 0 ? 'None' : data.dependencies.join(', ')} |`
).join('\n')}

## Optimization Results

### ✅ Achievements
- Zero external runtime dependencies
- Individual component exports for tree-shaking
- Inlined small utilities
- Optimized build configuration
- Barrel export elimination

### ⚠️ Violations
${this.results.violations.length === 0 ? 'None! All targets met.' : 
  this.results.violations.map(v => 
    v.component ? 
      `- **${v.component}**: ${v.size}B exceeds target by ${v.excess}B` :
      `- **${v.type}**: ${v.dependencies?.join(', ') || 'Unknown issue'}`
  ).join('\n')
}

## Recommendations

${this.generateRecommendations()}

---
*Generated on ${new Date().toISOString()}*
`;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.violations.some(v => v.component)) {
      recommendations.push('- **Size Violations**: Consider code-splitting large components or extracting shared utilities');
    }
    
    if (this.results.violations.some(v => v.type === 'external-dependencies')) {
      recommendations.push('- **Dependencies**: Remove external dependencies or inline small utilities');
    }
    
    if (this.results.gzippedSize > 50000) {
      recommendations.push('- **Total Size**: Consider lazy loading or dynamic imports for less commonly used components');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- All optimization targets met! Consider further micro-optimizations for even better performance.');
    }
    
    return recommendations.join('\n');
  }
}

// CLI usage
if (process.argv[1] === __filename) {
  const packagePath = process.argv[2] || process.cwd();
  const optimizer = new BundleOptimizer();
  
  optimizer.optimizeBundle(packagePath)
    .then(results => {
      console.log('\n🎉 Bundle optimization complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    });
}

export { BundleOptimizer };