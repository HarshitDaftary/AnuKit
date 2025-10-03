import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { swc } from 'rollup-plugin-swc3';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';

export function createRollupConfig(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    external = [],
    plugins = [],
    ...rest
  } = options;

  return {
    input,
    external: [
      'react',
      'react-dom',
      ...external
    ],
    output: [
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
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        rootDir: './src'
      }),
      swc({
        jsc: {
          target: 'es2018',
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        },
        minify: process.env.NODE_ENV === 'production'
      }),
      process.env.NODE_ENV === 'production' && terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }),
      filesize(),
      ...plugins
    ].filter(Boolean),
    ...rest
  };
}

export function createIconsRollupConfig(pkg) {
  return createRollupConfig(pkg, {
    input: 'src/index.ts',
    plugins: [
      // Additional icon-specific optimizations
    ]
  });
}