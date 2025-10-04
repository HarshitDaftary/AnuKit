import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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
    external: [...external, 'react', 'react-dom'],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        rootDir: './src',
        exclude: ['**/__tests__/**']
      })
    ]
  };
}

/**
 * Creates a Rollup configuration for icon packages
 */
export function createIconsRollupConfig(pkg) {
  return createRollupConfig(pkg, {
    external: ['react', 'react-dom']
  });
}
