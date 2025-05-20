/**
 * Validates the "exports" and "typesVersions" fields in the `dist/package.json`
 * by checking if referenced files match real paths via glob patterns.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';
import { globSync } from 'glob';

type ExportEntry = {
	default?: string;
	svelte?: string;
	types?: string;
};

type PkgExports = Record<string, ExportEntry>;

type PkgTypesVersions = {
	'>4.0': Record<string, string[]>;
};

const DIST_DIR = 'dist';
const PKG_PATH = join(DIST_DIR, 'package.json');

/**
 * Runs a glob match against a file pattern to ensure at least one match exists.
 *
 * @param label - A human-readable label for logging (e.g., "JS export for ./solid/*")
 * @param relativeGlob - Glob pattern relative to the `dist/` directory
 * @returns 0 if matched, 1 if no files matched
 */
function validatePathGlob(label: string, relativeGlob: string): number {
	const fullGlob = join(DIST_DIR, relativeGlob);
	const matches = globSync(fullGlob, { nodir: true });

	if (matches.length === 0) {
		console.warn(pc.yellow(`✘ No matches for ${label}: ${relativeGlob}`));
		return 1;
	}

	return 0;
}

/**
 * Reads and validates the `exports` and `typesVersions` fields in the dist package.json.
 * Ensures that each glob pattern resolves to at least one real file.
 */
function validate(): void {
	console.log(pc.blue('* Validating dist/package.json exports...\n'));

	const raw = readFileSync(PKG_PATH, 'utf-8');
	const pkg = JSON.parse(raw) as {
		exports?: PkgExports;
		typesVersions?: PkgTypesVersions;
	};

	const exportsMap = pkg.exports || {};
	const typesVersions = pkg.typesVersions?.['>4.0'] || {};

	let problems = 0;

	// Validate each export subpath
	for (const subpath in exportsMap) {
		const entry = exportsMap[subpath];
		const jsPath = entry.default ?? entry.svelte;
		const dtsPath = entry.types;

		if (jsPath) problems += validatePathGlob(`JS export for "${subpath}"`, jsPath);
		if (dtsPath) problems += validatePathGlob(`DTS export for "${subpath}"`, dtsPath);
	}

	// Validate each typesVersions entry
	for (const typePath in typesVersions) {
		const entries = typesVersions[typePath];
		for (const entry of entries) {
			problems += validatePathGlob(`typesVersions entry for "${typePath}"`, entry);
		}
	}

	if (problems > 0) {
		console.error(pc.red(`\n✘ Validation failed with ${problems} problem(s).`));
		process.exit(1);
	} else {
		console.log(pc.green(pc.bold('\n✔ All exports are valid.\n')));
	}
}

// Run validation
validate();
