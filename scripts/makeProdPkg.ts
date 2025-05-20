import type { PkgExports, PkgTypesVersions } from './index.js';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

import pc from 'picocolors';

const DIST_FOLDER = 'dist';
const PKG_JSON = 'package.json';

function main() {
	console.log(pc.blue('* Generating the package.json file...'));

	const entries: PkgExports = {
		'./components/solid/*.svelte': {
			types: './icons/solid/*.svelte.d.ts',
			svelte: './icons/solid/*.svelte',
			default: './icons/solid/*.svelte'
		},
		'./components/*.svelte': {
			types: './icons/regular/*.svelte.d.ts',
			svelte: './icons/regular/*.svelte',
			default: './icons/regular/*.svelte'
		},
		'./solid/*': {
			types: './icons/solid/*/index.d.ts',
			svelte: './icons/solid/*/index.js',
			default: './icons/solid/*/index.js'
		},
		'./*': {
			types: './icons/regular/*/index.d.ts',
			svelte: './icons/regular/*/index.js',
			default: './icons/regular/*/index.js'
		}
	};

	const typesVersion: PkgTypesVersions = {
		'>4.0': {
			'./components/solid/*.svelte': ['./icons/solid/*.svelte.d.ts'],
			'./components/*.svelte': ['./icons/regular/*.svelte.d.ts'],
			'./solid/*': ['./icons/solid/*/index.d.ts'],
			'./*': ['./icons/regular/*/index.d.ts']
		}
	};

	// Read and update package.json
	const pkgJsonContent = readFileSync(PKG_JSON, 'utf-8');
	const pkg = JSON.parse(pkgJsonContent);

	pkg.exports = entries;
	pkg.typesVersions = typesVersion;

	// Write the updated package.json to the dist directory
	const pathToPkgJson = join(DIST_FOLDER, PKG_JSON);
	writeFileSync(pathToPkgJson, JSON.stringify(pkg, null, 2));

	console.log(pc.green(pc.bold('* Completed!\n')));
}

// ----------------------------------------------------------------

main();
