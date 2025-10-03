import { createRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import pkg from './package.json' assert { type: 'json' };
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { swc } from 'rollup-plugin-swc3';
import filesize from 'rollup-plugin-filesize';

// Get all component directories for individual builds
const getComponentDirs = () => {
  try {
    return readdirSync(resolve('src')).filter(dir => {
      const fullPath = resolve('src', dir);
      return statSync(fullPath).isDirectory() && dir !== '__tests__';
    });
  } catch {
    return ['Button', 'Modal', 'Input', 'Checkbox', 'Radio', 'Switch', 'Tooltip'];
  }
};

const componentDirs = getComponentDirs();

// Enhanced optimization plugins
const optimizationPlugins = [
  // Advanced minification with tree-shaking
  terser({
    compress: {
      drop_console: true,
      drop_debugger: true,
      passes: 3, // Multiple passes for better optimization
      pure_getters: true,
      pure_funcs: ['console.log', 'console.info'],
      toplevel: true, // Enable top-level optimizations
      dead_code: true,
      side_effects: false
    },
    mangle: {
      properties: {
        regex: /^_/ // Mangle private properties
      }
    },
    format: {
      comments: false,
      ecma: 2020
    }
  }),
  
  // Bundle size monitoring
  filesize({
    showBrotliSize: true,
    showGzippedSize: true,
    showMinifiedSize: true
  })
];

// Create base configuration
const createOptimizedConfig = (input, output, name) => ({
  input,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  output,
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      rootDir: './src',
      declarationMap: true
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
        },
        externalHelpers: false,
        keepClassNames: false,
        minify: {
          compress: {
            unused: true,
            dead_code: true
          },
          mangle: true
        }
      },
      minify: process.env.NODE_ENV === 'production'
    }),
    ...optimizationPlugins
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false
  }
});

// Main bundle configuration
const mainConfig = createOptimizedConfig(
  'src/index.ts',
  [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  'main'
);

// Individual component configurations for maximum tree-shaking
const componentConfigs = componentDirs.map(componentName => {
  return createOptimizedConfig(
    `src/${componentName}/index.ts`,
    [
      {
        file: `dist/${componentName}/index.js`,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: `dist/${componentName}/index.esm.js`,
        format: 'esm',
        sourcemap: true
      }
    ],
    componentName
  );
});

export default [mainConfig, ...componentConfigs];