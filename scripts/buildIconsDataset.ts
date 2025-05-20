/**
 * Build script that:
 * - Parses SVGs into Svelte components
 * - Writes compiled JS for each icon
 * - Emits proper TypeScript exports
 * - Supports both `regular` and `solid` variants
 */

import type { Nodes } from 'hast';
import type { Icon, IconVariant } from './index.d.ts';
import { toHtml } from 'hast-util-to-html';
import { ElementNode, parse, RootNode } from 'svg-parser';
import { fileURLToPath } from 'node:url';
import { join, dirname, basename } from 'node:path';
import { promises as fsp } from 'node:fs';
import cliProgress from 'cli-progress';
import pc from 'picocolors';
import { compile } from 'svelte/compiler';

import {
	mkDir,
	makeComponentFilename,
	makeComponentName,
	generateExportEntryString,
	generateIconComponentIndex
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const SRC_ICONS_FOLDER = join(__dirname, '..', '..', 'src', 'lib', 'icons');
const DIST_ICONS_FOLDER = join(__dirname, '..', '..', 'dist', 'icons');

const REGULAR_ICONS = join(INPUT_FOLDER, 'regular');
const SOLID_ICONS = join(INPUT_FOLDER, 'solid');
const ICONS_FOLDERS = [REGULAR_ICONS, SOLID_ICONS];

let counter = 0;

// Create a new progress bar instance with the shades_classic theme.
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);

// ----------------------------------------------------------------

/**
 * Entry point: builds icon components and compiles them to JS.
 */
async function main() {
	await mkDir(SRC_ICONS_FOLDER);
	await mkDir(DIST_ICONS_FOLDER);

	console.log(pc.blue('* Getting list of all icons...'));

	for (const folder of ICONS_FOLDERS) {
		const variant = basename(folder);
		const files = await fsp.readdir(folder, 'utf-8');
		const icons = await makeIconObjsList(variant, files);

		await generateFolderTree(SRC_ICONS_FOLDER, icons);
		await generateIconsDataset(folder, SRC_ICONS_FOLDER, DIST_ICONS_FOLDER, icons);
	}
}

// ----------------------------------------------------------------

/**
 * Creates metadata for each icon from a folder.
 *
 * @param folder - Icon variant folder (e.g. "regular" or "solid")
 * @param files - List of SVG file names
 * @returns A list of `Icon` objects with metadata
 */
async function makeIconObjsList(folder: string, files: string[]): Promise<Icon[]> {
	return files.map((file) => {
		const name = file.split('.').slice(0, -1).join('.');
		const componentFolder = name;
		const component = makeComponentName(name);

		return {
			svgFile: file,
			name,
			variant: folder as IconVariant,
			component,
			componentFolder
		};
	});
}

/**
 * Creates the output folder structure for each icon.
 *
 * @param iconsOutputFolder - Base output folder (e.g. src/lib/icons)
 * @param icons - List of icon metadata
 */
async function generateFolderTree(iconsOutputFolder: string, icons: Icon[]): Promise<void> {
	await Promise.all(
		icons.map((icon) => mkDir(join(iconsOutputFolder, icon.variant, icon.componentFolder)))
	);
}

/**
 * Parses SVG, generates Svelte + compiled JS + type files for each icon.
 *
 * @param inputFolder - Path to original SVGs
 * @param srcOutputFolder - Path to `.svelte` files (for `svelte-package`)
 * @param distOutputFolder - Path to compiled `.js` files
 * @param icons - List of icon metadata
 */
async function generateIconsDataset(
	inputFolder: string,
	srcOutputFolder: string,
	distOutputFolder: string,
	icons: Icon[]
): Promise<void> {
	progressBar.start(icons.length, 0, { filename: 'N/A' });

	await Promise.all(
		icons.map(async (icon) => {
			const svgRaw = await fsp.readFile(join(inputFolder, icon.svgFile), 'utf8');
			const svgAst = parse(svgRaw) as RootNode;
			const elem = svgAst.children[0] as ElementNode;
			icon.data = toHtml(elem.children as unknown as Nodes);

			counter++;

			// Write .svelte to src (for dev/kit packaging)
			const svelteFile = await writeSvelteFile(srcOutputFolder, icon);

			// Compile to JS (.js output to dist/)
			await writeCompiledJS(svelteFile, distOutputFolder, icon);

			// Write type + index entry
			await generateIconComponentIndex(srcOutputFolder, icon); // for d.ts
			await appendToIndexTs(icon);

			progressBar.update(counter, { filename: icon.name });
		})
	);

	progressBar.stop();
}

/**
 * Generates the Svelte `.svelte` file for an icon.
 *
 * @param outputRoot - Root output dir (e.g. src/lib/icons)
 * @param icon - Icon metadata
 * @returns Full path to the generated Svelte file
 */
async function writeSvelteFile(outputRoot: string, icon: Icon): Promise<string> {
	const sveltePath = join(outputRoot, icon.variant, icon.componentFolder, 'index.svelte');
	const source = `<script lang="ts">
  import type { SVGProps } from '../../../Icon.d.ts';
  import IconoirBase from '../../../IconoirBase.svelte';

  interface $$Props extends SVGProps {}

  export let name: $$Props['name'] = '${icon.name}';
  export let altText: $$Props['altText'] = undefined;
  export let size: $$Props['size'] = 'base';
</script>

<IconoirBase {name} {altText} {size}
  on:click
  on:dblclick
  on:keydown
  on:keyup
  on:mouseenter
  on:mouseleave
  {...$$restProps}>
  ${icon.data}
</IconoirBase>`;

	await fsp.writeFile(sveltePath, source);
	return sveltePath;
}

/**
 * Compiles a `.svelte` file to `.js` using Svelte compiler.
 *
 * @param svelteFile - Path to the source `.svelte` file
 * @param distOutputRoot - Base output dir (e.g. dist/icons)
 * @param icon - Icon metadata
 */
async function writeCompiledJS(
	svelteFile: string,
	distOutputRoot: string,
	icon: Icon
): Promise<void> {
	const source = await fsp.readFile(svelteFile, 'utf8');
	const { js } = compile(source, {
		filename: 'index.svelte',
		generate: 'client'
	});

	const jsOutDir = join(distOutputRoot, icon.variant, icon.componentFolder);
	await mkDir(jsOutDir);
	await fsp.writeFile(join(jsOutDir, 'index.js'), js.code);
}

/**
 * Appends an `export` statement to the variant index file (e.g. `icons/regular/index.ts`)
 *
 * @param icon - Icon metadata
 */
async function appendToIndexTs(icon: Icon): Promise<void> {
	const indexFile = join(__dirname, '..', '..', 'src', 'lib', 'icons', icon.variant, 'index.ts');
	const folder = dirname(indexFile);

	// Ensure the folder exists
	await mkDir(folder);

	// Ensure the index.ts file exists (create it if needed)
	try {
		await fsp.access(indexFile);
	} catch {
		await fsp.writeFile(indexFile, '');
	}

	const exportString = generateExportEntryString(icon);

	progressBar.update(counter, { filename: icon.name });

	await fsp.appendFile(indexFile, exportString);
}

// ----------------------------------------------------------------

await main();
