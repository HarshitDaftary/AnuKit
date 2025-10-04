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
    // Treat internal workspace packages as externals; resolve at consumer level
    '@optimui/utils',
    '@optimui/utils/sizeMode',
    '@optimui/core',
    '@optimui/core/providers/SSRProvider',
    '@optimui/core/hooks/accessibility-hooks'
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
      // Prevent plugin from trying to emit declarations for external types with relative paths
      // Declarations will reference the packages' own published types via node resolution
      resolveJsonModule: true
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