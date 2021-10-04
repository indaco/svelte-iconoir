import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{ file: pkg.module, format: 'es' },
		{ file: pkg.main, format: 'umd', name: 'Iconoir' },
	],
	plugins: [svelte(), json(), resolve(), terser()],
};
