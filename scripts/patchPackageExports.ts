import type { PkgExports, PkgTypesVersions } from './index.js';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import pc from 'picocolors';

const DIST_FOLDER = 'dist';
const PKG_JSON = 'package.json';

function main() {
	console.log(pc.blue('* Generating the package.json file...'));

	const exportsMap: PkgExports = {
		'./solid/*': {
			types: './icons/solid/*/index.d.ts',
			svelte: './icons/solid/*/index.js',
			default: './icons/solid/*/index.js'
		},
		'./*': {
			types: './icons/regular/*/index.d.ts',
			svelte: './icons/regular/*/index.js',
			default: './icons/regular/*/index.js'
		},
		'./package.json': './package.json'
	};

	const typesVersions: PkgTypesVersions = {
		'>4.0': {
			'./solid/*': ['./icons/solid/*/index.d.ts'],
			'./*': ['./icons/regular/*/index.d.ts']
		}
	};

	// Read and prune the original package.json
	const raw = readFileSync(PKG_JSON, 'utf-8');
	const original = JSON.parse(raw);

	const cleaned = {
		name: original.name,
		version: original.version,
		description: original.description,
		keywords: original.keywords,
		author: original.author,
		license: original.license,
		repository: original.repository,
		bugs: original.bugs,
		sideEffects: false,
		type: 'module',
		peerDependencies: original.peerDependencies,
		files: ['icons', 'README.md', 'LICENSE', 'Icon.d.ts', 'IconoirBase.svelte'],
		exports: exportsMap,
		typesVersions: typesVersions
	};

	const pathToDistPkgJson = join(DIST_FOLDER, PKG_JSON);
	writeFileSync(pathToDistPkgJson, JSON.stringify(cleaned, null, 2));

	console.log(pc.green(pc.bold('* Completed!\n')));
}

main();
