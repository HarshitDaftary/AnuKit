import { createRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const base = createRollupConfig(pkg, { external: ['clsx'] });

// Add secondary entry for sizeMode
export default [
  base,
  {
    ...base,
    input: 'src/sizeMode.ts',
    output: [
      { file: 'dist/sizeMode.js', format: 'cjs', sourcemap: true, exports: 'named' },
      { file: 'dist/sizeMode.esm.js', format: 'esm', sourcemap: true },
    ],
  }
];