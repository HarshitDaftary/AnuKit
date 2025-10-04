import { createIconsRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default createIconsRollupConfig(pkg);