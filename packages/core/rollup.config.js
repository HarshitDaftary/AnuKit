import { createRollupConfig } from '../../tools/build-tools/configs/rollup.config.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default createRollupConfig(pkg, {
	// Avoid bundling test libs; keep them external to prevent rollup ESM CJS interop issues
	external: [
		/^@testing-library\//,
		'dom-accessibility-api',
		'pretty-format',
		'aria-query',
		'lz-string',
		'react-dom/client',
		'react-dom/test-utils'
	]
});
