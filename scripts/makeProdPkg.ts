import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import pc from 'picocolors';
import {
	relativePath,
	makeComponentName,
	makeComponentFilename,
	makeComponentDTSFilename
} from './utils.js';

type SvelteComponentExportItem = {
	types: string;
	svelte: string;
	default: string;
};

type PkgExports = {
	[key: string]: string | SvelteComponentExportItem;
};

type PkgTypesVersions = {
	[key: string]: Record<string, string[]>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_FOLDER = 'dist';
const PKG_JSON = 'package.json';
const COMPONENTS_FOLDER = 'components';
const ICONS_FOLDER = 'icons';
const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', ICONS_FOLDER);

// ----------------------------------------------------------------

function main() {
	console.log(pc.blue('* Generating the package.json file...'));
	const files = readdirSync(INPUT_FOLDER);

	const entries = makePkgExportsObj(ICONS_FOLDER, COMPONENTS_FOLDER, files);
	const typesVersion = makePkgTypesVersionsObj(ICONS_FOLDER, COMPONENTS_FOLDER, files);

	const pkgJsonContent = readFileSync(PKG_JSON, 'utf-8');
	const pkg = JSON.parse(pkgJsonContent);

	pkg.exports = entries;
	pkg.typesVersions = typesVersion;

	// write it to the dist directory
	const pathToPkgJson = join(DIST_FOLDER, PKG_JSON);
	writeFileSync(pathToPkgJson, JSON.stringify(pkg, null, 2));

	console.log(pc.green(pc.bold('* Completed!\n')));
}

// ----------------------------------------------------------------

function newSvelteComponentExportItem(t: string, s: string, d: string): SvelteComponentExportItem {
	return {
		types: relativePath(t),
		svelte: relativePath(s),
		default: relativePath(d)
	} satisfies SvelteComponentExportItem;
}

/**
 * It takes a list of icon names, and returns an object that maps the names of the files that
 * will be generated to the names of the files that will be generated.
 *
 * @param {string} iconsFolder - The folder where the icons are located.
 * @param {string} componentsFolder - The folder where the Svelte components are located.
 * @param {string[]} files - An array of the icon filenames (without extensions).
 *
 * @returns An object with the following structure:
 * {
 * 	'./package.json': './package.json',
 * 	'./icons/icon-name/index.d.ts': {
 * 		typings: './icons/icon-name/index.d.ts',
 * 		default: './icons/icon-name/index.js'
 * 	},
 */
function makePkgExportsObj(
	iconsFolder: string,
	componentsFolder: string,
	files: string[]
): PkgExports {
	let pkgExportsObj: PkgExports = {
		'./package.json': './package.json'
	};

	files.reduce((acc: PkgExports, curr: string) => {
		const filename = curr.split('.').slice(0, -1).join('.');
		const iconComponent = makeComponentName(filename);

		const indexPropName = relativePath(filename);
		acc[indexPropName] = newSvelteComponentExportItem(
			join(iconsFolder, filename, 'index.d.ts'),
			join(iconsFolder, filename, 'index.js'),
			join(iconsFolder, filename, 'index.js')
		);

		const sveltePropName = relativePath(
			join(componentsFolder, makeComponentFilename(iconComponent))
		);

		acc[sveltePropName] = newSvelteComponentExportItem(
			join(iconsFolder, filename, makeComponentDTSFilename(iconComponent)),
			join(iconsFolder, filename, makeComponentFilename(iconComponent)),
			join(iconsFolder, filename, makeComponentFilename(iconComponent))
		);

		return acc;
	}, pkgExportsObj as PkgExports);

	pkgExportsObj['.'] = {
		types: relativePath('index.d.ts'),
		svelte: relativePath('index.js'),
		default: relativePath('index.js')
	};

	return pkgExportsObj;
}

/**
 * It takes a list of files, and returns an object that maps the file names to the relative
 * paths of their TypeScript definitions.
 *
 * Refer to: https://kit.svelte.dev/docs/packaging#typescript
 *
 * @param {string} iconsFolder - The folder where the icons are located.
 * @param {string} componentsFolder - The folder where the Svelte components are located.
 * @param {string[]} files -  An array of the icon filenames (without extensions).
 *
 * @returns An object adhering to the typesVersions in the package.json file
 */
function makePkgTypesVersionsObj(
	iconsFolder: string,
	componentsFolder: string,
	files: string[]
): PkgTypesVersions {
	let dtsObj: PkgTypesVersions = {
		'>4.0': {}
	};

	files.reduce((acc: Record<string, string[]>, curr: string) => {
		const filename = curr.split('.').slice(0, -1).join('.');
		const iconFilename = makeComponentName(filename);
		const iconComponentFilename = makeComponentFilename(iconFilename);
		const iconComponentDTSFilename = makeComponentDTSFilename(iconFilename);

		acc[filename] = [];
		acc[filename].push(relativePath(join(iconsFolder, filename, 'index.d.ts')));

		const sveltePropName = join(componentsFolder, iconComponentFilename);
		acc[sveltePropName] = [];
		acc[sveltePropName].push(relativePath(join(iconsFolder, filename, iconComponentDTSFilename)));

		return acc;
	}, dtsObj['>4.0']);

	dtsObj['>4.0']['index'] = [relativePath('index.d.ts')];

	return dtsObj;
}

// ----------------------------------------------------------------

main();
