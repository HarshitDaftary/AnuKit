import { createIconsRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import pkg from './package.json' with { type: 'json' };

export default createIconsRollupConfig(pkg);