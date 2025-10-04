import { createRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);