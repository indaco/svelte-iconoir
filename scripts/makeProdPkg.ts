import type {
	IconVariant,
	PkgExports,
	PkgTypesVersions,
	SvelteComponentExportItem
} from './index.js';
import { fileURLToPath } from 'node:url';
import { join, dirname, basename } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { makeComponentFilename, makeComponentName, relativePath } from './utils.js';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_FOLDER = 'dist';
const PKG_JSON = 'package.json';
const COMPONENTS_FOLDER = 'components';
const ICONS_BASE_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const REGULAR_ICONS = join(ICONS_BASE_FOLDER, 'regular');
const SOLID_ICONS = join(ICONS_BASE_FOLDER, 'solid');
const ICONS_FOLDERS = [REGULAR_ICONS, SOLID_ICONS];

const makeIconPaths = (iconVariant: string, filename: string) => {
	const base = join('icons', iconVariant, filename);
	return {
		types: relativePath(join(base, 'index.d.ts')),
		svelte: relativePath(join(base, 'index.js')),
		default: relativePath(join(base, 'index.js'))
	} satisfies SvelteComponentExportItem;
};

const makeComponentPaths = (iconVariant: string, filename: string, componentFilename: string) => {
	const base = join('icons', iconVariant, filename, componentFilename);
	return {
		types: relativePath(`${base}.d.ts`),
		svelte: relativePath(base),
		default: relativePath(base)
	} satisfies SvelteComponentExportItem;
};

function main() {
	console.log(pc.blue('* Generating the package.json file...'));

	const entries: PkgExports = {};
	const typesVersion: PkgTypesVersions = { '>4.0': {} };

	ICONS_FOLDERS.forEach((folder) => {
		try {
			const files = readdirSync(folder);

			files.forEach((filename) => {
				const iconVariantName = basename(folder) as IconVariant;
				const iconName = filename.split('.').slice(0, -1).join('.');
				const iconComponent = makeComponentName(iconName);

				try {
					const iconPaths = makeIconPaths(iconVariantName, iconName);
					const componentPaths = makeComponentPaths(
						iconVariantName,
						iconName,
						makeComponentFilename(iconComponent)
					);

					if (iconVariantName === 'regular') {
						entries[relativePath(iconName)] = iconPaths;
					}
					entries[relativePath(join(iconVariantName, iconName))] = iconPaths;

					// Direct access to the component
					if (iconVariantName === 'regular') {
						entries[relativePath(join(COMPONENTS_FOLDER, makeComponentFilename(iconComponent)))] =
							componentPaths;
					}
					entries[
						relativePath(
							join(COMPONENTS_FOLDER, iconVariantName, makeComponentFilename(iconComponent))
						)
					] = componentPaths;

					// Build typesVersions
					if (iconVariantName === 'regular') {
						typesVersion['>4.0'][relativePath(iconName)] = [iconPaths.types];
					}
					typesVersion['>4.0'][relativePath(join(iconVariantName, iconName))] = [iconPaths.types];

					if (iconVariantName === 'regular') {
						typesVersion['>4.0'][
							relativePath(join(COMPONENTS_FOLDER, makeComponentFilename(iconComponent)))
						] = [componentPaths.types];
					}
					typesVersion['>4.0'][
						relativePath(
							join(COMPONENTS_FOLDER, iconVariantName, makeComponentFilename(iconComponent))
						)
					] = [componentPaths.types];
				} catch (error) {
					console.error('Error processing file:', error);
					// Handle or log the error as needed
				}
			});
		} catch (error) {
			console.error('Error reading directory:', error);
			// Handle or log the error as needed
		}
	});

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
