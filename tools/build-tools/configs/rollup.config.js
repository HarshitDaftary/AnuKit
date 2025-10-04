import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * Creates a basic Rollup configuration for OptimUI packages
 */
export function createRollupConfig(pkg, options = {}) {
  const { external = [] } = options;
  
  return {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main || 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module || 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external: [...external, 'react', 'react-dom', 'react/jsx-runtime'],
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        rootDir: './src',
        exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx', '**/testing/**']
      })
    ]
  };
}

/**
 * Creates a Rollup configuration for icon packages
 */
export function createIconsRollupConfig(pkg) {
  const config = createRollupConfig(pkg, {
    external: ['react', 'react-dom']
  });
  // Icons use JSX, so use .tsx extension
  config.input = 'src/index.tsx';
  return config;
}
