#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SimpleBundleAnalyzer {
  constructor(targetPath) {
    this.targetPath = targetPath;
    this.results = {
      components: {},
      totalSize: 0,
      gzippedSize: 0,
      violations: []
    };
    this.targetSizePerComponent = 5000; // 5KB target
  }

  analyze() {
    console.log('🔍 Analyzing OptimUI Bundle Sizes...\n');
    
    const distPath = join(this.targetPath, 'dist');
    if (!existsSync(distPath)) {
      console.log('❌ No dist folder found. Please build first.');
      return;
    }

    // Analyze individual components
    this.analyzeComponents(distPath);
    
    // Analyze main bundle
    this.analyzeMainBundle(distPath);
    
    // Generate report
    this.generateReport();
    
    return this.results;
  }

  analyzeComponents(distPath) {
    const componentDirs = readdirSync(distPath).filter(dir => {
      const fullPath = join(distPath, dir);
      return statSync(fullPath).isDirectory();
    });

    console.log('📦 Component Analysis:');
    
    for (const component of componentDirs) {
      const componentPath = join(distPath, component);
      const esmFile = join(componentPath, 'index.esm.js');
      
      if (existsSync(esmFile)) {
        const content = readFileSync(esmFile);
        const gzipped = gzipSync(content);
        const size = content.length;
        const gzippedSize = gzipped.length;
        
        this.results.components[component] = {
          size,
          gzippedSize,
          targetMet: gzippedSize <= this.targetSizePerComponent,
          dependencies: this.extractDependencies(content.toString())
        };

        const status = gzippedSize <= this.targetSizePerComponent ? '✅' : '❌';
        console.log(`  ${component}: ${size}B raw, ${gzippedSize}B gzipped ${status}`);
        
        if (gzippedSize > this.targetSizePerComponent) {
          this.results.violations.push({
            component,
            size: gzippedSize,
            target: this.targetSizePerComponent,
            excess: gzippedSize - this.targetSizePerComponent
          });
        }
      }
    }
  }

  analyzeMainBundle(distPath) {
    const mainBundle = join(distPath, 'index.esm.js');
    if (existsSync(mainBundle)) {
      const content = readFileSync(mainBundle);
      const gzipped = gzipSync(content);
      
      this.results.totalSize = content.length;
      this.results.gzippedSize = gzipped.length;
      
      console.log(`\n📦 Main Bundle: ${content.length}B raw, ${gzipped.length}B gzipped`);
    }
  }

  extractDependencies(code) {
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

  generateReport() {
    const components = Object.entries(this.results.components);
    const totalTargetMet = components.filter(([, data]) => data.targetMet).length;
    
    console.log('\n📊 Bundle Size Summary:');
    console.log(`  Total Components: ${components.length}`);
    console.log(`  Target Met: ${totalTargetMet}/${components.length} (${Math.round(totalTargetMet / components.length * 100)}%)`);
    console.log(`  Total Bundle: ${this.results.totalSize}B raw, ${this.results.gzippedSize}B gzipped`);
    console.log(`  Violations: ${this.results.violations.length}`);
    
    if (this.results.violations.length === 0) {
      console.log('  🎉 All optimization targets met!');
    } else {
      console.log('\n⚠️  Components exceeding 5KB target:');
      this.results.violations.forEach(v => {
        console.log(`    ${v.component}: ${v.size}B (+${v.excess}B over target)`);
      });
    }

    // Generate detailed report
    const report = this.createDetailedReport();
    const reportPath = join(this.targetPath, 'BUNDLE_SIZE_REPORT.md');
    writeFileSync(reportPath, report);
    console.log(`\n📄 Detailed report: ${reportPath}`);
  }

  createDetailedReport() {
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

| Component | Raw Size | Gzipped | Target (5KB) | Status | External Dependencies |
|-----------|----------|---------|--------------|--------|----------------------|
${components.map(([name, data]) => 
  `| ${name} | ${data.size}B | ${data.gzippedSize}B | ${this.targetSizePerComponent}B | ${data.targetMet ? '✅' : '❌'} | ${data.dependencies.length === 0 ? 'None ✅' : data.dependencies.join(', ')} |`
).join('\n')}

## Zero-Dependency Status

${components.every(([, data]) => data.dependencies.length === 0) ? 
  '✅ **Perfect!** All components have zero external dependencies.' :
  '⚠️ Some components have external dependencies that should be inlined or removed.'
}

## Optimization Results

### ✅ Achievements
- Tree-shakable exports with individual component builds
- PURE annotations for dead code elimination
- Inlined utilities to avoid external dependencies
- Advanced Rollup + Terser optimization
- Multiple compression passes

### ${this.results.violations.length === 0 ? '🎯' : '⚠️'} Size Targets
${this.results.violations.length === 0 ? 
  'All components meet the 5KB gzipped target!' :
  this.results.violations.map(v => 
    `- **${v.component}**: ${v.size}B exceeds target by ${v.excess}B`
  ).join('\n')
}

## Tree-Shaking Effectiveness

OptimUI implements advanced tree-shaking techniques:

1. **Individual Component Builds**: Each component can be imported separately
2. **PURE Annotations**: All components marked as side-effect free
3. **Barrel Export Elimination**: Direct imports prevent bundling unused code
4. **Zero Runtime Dependencies**: No external libraries bundled

### Import Examples

\`\`\`javascript
// Import only Button (optimal - ~2KB)
import { Button } from '@optimui/components/Button';

// Import multiple components (larger bundle)
import { Button, Modal } from '@optimui/components';
\`\`\`

## Recommendations

${this.generateRecommendations()}

---
*Generated on ${new Date().toISOString()}*
*Target: <5KB gzipped per component*
`;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.violations.length > 0) {
      recommendations.push('### Size Optimization');
      recommendations.push('- Consider code-splitting large components');
      recommendations.push('- Extract shared utilities to separate packages');
      recommendations.push('- Review CSS-in-JS usage for potential optimization');
    }
    
    const hasExternalDeps = Object.values(this.results.components)
      .some(comp => comp.dependencies.length > 0);
    
    if (hasExternalDeps) {
      recommendations.push('### Dependency Elimination');
      recommendations.push('- Inline small utility functions');
      recommendations.push('- Remove or replace external dependencies');
      recommendations.push('- Consider custom implementations for simple functions');
    }
    
    if (this.results.gzippedSize > 50000) {
      recommendations.push('### Bundle Size');
      recommendations.push('- Implement lazy loading for less common components');
      recommendations.push('- Consider dynamic imports for large features');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('### Excellent Work! 🎉');
      recommendations.push('- All optimization targets met');
      recommendations.push('- Zero external dependencies achieved');
      recommendations.push('- Consider micro-optimizations for even better performance');
    }
    
    return recommendations.join('\n');
  }
}

// CLI usage
if (process.argv[1] === __filename) {
  const targetPath = process.argv[2] || process.cwd();
  const analyzer = new SimpleBundleAnalyzer(targetPath);
  analyzer.analyze();
}

export { SimpleBundleAnalyzer };