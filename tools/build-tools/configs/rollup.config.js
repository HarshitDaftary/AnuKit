import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { swc } from 'rollup-plugin-swc3';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

export function createRollupConfig(pkg, { external = [] } = {}) {
  return {
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'react/jsx-runtime', ...external],
    output: [
      { file: pkg.main || 'dist/index.js', format: 'cjs', sourcemap: true, exports: 'named' },
      { file: pkg.module || 'dist/index.esm.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      nodeResolve({ browser: true, preferBuiltins: false }),
      typescript({ tsconfig: './tsconfig.json', declaration: true, declarationDir: './dist', rootDir: './src', declarationMap: true }),
      swc({
        jsc: {
          target: 'es2018',
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic', refresh: false, development: false } },
        },
        minify: process.env.NODE_ENV === 'production',
      }),
      terser({ format: { comments: false } }),
      filesize({ showBrotliSize: true, showGzippedSize: true, showMinifiedSize: true })
    ],
    treeshake: { moduleSideEffects: false, propertyReadSideEffects: false }
  };
}

export function createIconsRollupConfig(pkg) {
  return createRollupConfig(pkg, { external: [] });
}
