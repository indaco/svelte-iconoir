import type { Nodes } from 'hast-util-to-html/lib/index.js';
import type { Icon, IconVariant } from './index.d.ts';
import { toHtml } from 'hast-util-to-html';
import { parse } from 'svg-parser';
import { fileURLToPath } from 'node:url';
import { join, dirname, basename } from 'node:path';
import { promises as fsp } from 'node:fs';
import cliProgress from 'cli-progress';
import pc from 'picocolors';

import {
	mkDir,
	makeComponentFilename,
	makeComponentName,
	capitalizeFirstLetter,
	generateIconComponentIndex,
	generateExportEntryString
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const ICONS_OUTPUT_FOLDER = join(__dirname, '..', '..', 'src', 'lib', 'icons');

const REGULAR_ICONS = join(INPUT_FOLDER, 'regular');
const SOLID_ICONS = join(INPUT_FOLDER, 'solid');
const ICONS_FOLDERS = [REGULAR_ICONS, SOLID_ICONS];

let counter = 0;

// Create a new progress bar instance with the shades_classic theme.
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);

// ----------------------------------------------------------------

async function main() {
	await mkDir(ICONS_OUTPUT_FOLDER);

	console.log(pc.blue('* Getting list of all icons...'));

	console.log(pc.blue('* Generating icon components...'));
	for (const folder of ICONS_FOLDERS) {
		const folderName = basename(folder);
		const files = await fsp.readdir(folder, 'utf-8');
		const icons = await makeIconObjsList(folderName, files);

		await generateFolderTree(join(ICONS_OUTPUT_FOLDER, folderName), icons);
		await generateIconsDataset(folder, join(ICONS_OUTPUT_FOLDER, folderName), icons);
	}
}

// ----------------------------------------------------------------

/**
 * It takes a list of file names, and returns a list of objects that contain the file name, the
 * name of the icon, the name of the component, the name of the component file, and the name of
 * the component folder.
 *
 * @param {string[]} files - the list of files in the icons folder
 *
 * @returns An array of Icon objects.
 */
async function makeIconObjsList(folder: string, files: string[]): Promise<Icon[]> {
	return Promise.all(
		files.map(async (file) => {
			const svgFile = file;
			const name = file.split('.').slice(0, -1).join('.');
			const variant = folder as IconVariant;
			const componentFolder = name;
			const component = makeComponentName(name);
			const componentFile = makeComponentFilename(component);

			return {
				svgFile,
				name,
				variant,
				component,
				componentFile,
				componentFolder
			};
		})
	);
}

/**
 * It takes an array of icon objects and creates a folder for each icon in the iconsOutputFolder.
 *
 * @param {string} iconsOutputFolder - The folder where a folder for each icon will be generated.
 * @param {Icon[]} icons  - this is the array of icon objects.
 */
async function generateFolderTree(iconsOutputFolder: string, icons: Icon[]): Promise<void> {
	await Promise.all(
		icons.map(async (icon) => {
			await mkDir(join(iconsOutputFolder, icon.componentFolder));
		})
	);
}

/**
 * It reads the SVG file, parses it, extracts the data, generates the Svelte component, generates
 * the index.ts and index.d.ts files, and appends an entry to the index.ts file.
 *
 * @param {string} inputFolder - the folder where the original SVG files are located
 * @param {string} iconsOutputFolder - the folder where the generated icon components will be stored
 * @param {Icon[]} icons - an array of icons that we'll be generating
 */
async function generateIconsDataset(
	inputFolder: string,
	iconsOutputFolder: string,
	icons: Icon[]
): Promise<void> {
	progressBar.start(icons.length, 0, {
		filename: 'N/A'
	});

	await Promise.all(
		icons.map(async (icon) => {
			const svgRaw = await fsp.readFile(join(inputFolder, icon.svgFile), 'utf8');
			const svgAst = parse(svgRaw);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const elem: svgParser.RootNode = svgAst.children[0];
			icon.data = toHtml(elem.children as unknown as Nodes);

			counter++;

			// generate svelte component for each icon
			await makeIconComponent(iconsOutputFolder, icon);
			// generate index.ts and index.d.ts files for each icon
			await generateIconComponentIndex(iconsOutputFolder, icon);
			// append an entry to index.ts file
			await appendToIndexTs(icon);

			progressBar.update(counter, {
				filename: `${icon.componentFile}`
			});
		})
	);

	progressBar.stop();
}

/**
 * It takes an icon object and writes a Svelte component file to the output folder.
 *
 * @param {string} outputFolder - The folder to output the icon components to.
 * @param {Icon} iconObj - The icon object from the icons.json file
 */
async function makeIconComponent(outputFolder: string, iconObj: Icon): Promise<void> {
	const txt = `<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  const sizeMap = {
    xs: '1em',
    sm: '1.25em',
    base: '1.5em',
    lg: '1.75em',
    xl: '2em',
  };

  type IconSize = keyof typeof sizeMap;

  interface $$Props extends SVGAttributes<SVGElement> {
    size?: IconSize | string | number;
    altText?: string;
  }

  export let altText = $$props.altText ?? '${capitalizeFirstLetter(iconObj.name)} icon';

  const defaultSize = sizeMap['base'];

  let _size: string;

  $: _size =
    $$props.size in sizeMap
      ? sizeMap[$$props.size as unknown as IconSize]
      : typeof $$props.size === 'number' || typeof $$props.size === 'string'
      ? $$props.size
      : defaultSize;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={_size}
  height={_size}
  fill="none"
  stroke-width="1.5"
  viewBox="0 0 24 24"
  aria-hidden="true"
  aria-labelledby={altText}
  on:click
  on:dblclick
  on:keydown
  on:keyup
  on:mouseenter
  on:mouseleave
  {...$$restProps}
>
  ${iconObj.data}
</svg>`;

	await fsp.writeFile(join(outputFolder, iconObj.componentFolder, iconObj.componentFile), txt);
}

/**
 * It takes an icon object, and appends an export entry to the file.
 *
 * @param {Icon} iconObj - The icon object from the JSON file.
 */
async function appendToIndexTs(iconObj: Icon): Promise<void> {
	const indexFile = join(__dirname, '..', '..', 'src', 'lib', 'icons', iconObj.variant, 'index.ts');
	const exportString = generateExportEntryString(iconObj);

	progressBar.update(counter, {
		filename: `${iconObj.componentFile}`
	});

	await fsp.appendFile(indexFile, exportString);
}

// ----------------------------------------------------------------

await main();
