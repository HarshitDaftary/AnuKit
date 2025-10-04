import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';

const createOptimizedConfig = (input, file, format) => ({
  input,
  external: [
    'react', 
    'react-dom', 
    'react/jsx-runtime',
    '@anukit/utils',
    '@anukit/utils/sizeMode',
    '@anukit/core',
    '@anukit/core/providers/SSRProvider',
    '@anukit/core/hooks/accessibility-hooks'
  ],
  output: {
    file,
    format,
    sourcemap: true,
    exports: format === 'cjs' ? 'named' : undefined
  },
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
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx']
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_getters: true,
        toplevel: true,
        dead_code: true,
        side_effects: false
      },
      mangle: true,
      format: {
        comments: false,
        ecma: 2020
      }
    }),
    filesize({
      showBrotliSize: true,
      showGzippedSize: true
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
});

export default [
  // Main bundle
  createOptimizedConfig('src/index.ts', 'dist/index.js', 'cjs'),
  createOptimizedConfig('src/index.ts', 'dist/index.esm.js', 'esm'),
  
  // Individual components
  createOptimizedConfig('src/Button/index.ts', 'dist/Button/index.js', 'cjs'),
  createOptimizedConfig('src/Button/index.ts', 'dist/Button/index.esm.js', 'esm'),
];