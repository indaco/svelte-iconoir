import type { ElementNode } from 'svg-parser';
import { parse } from 'svg-parser';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { promises as fsp } from 'node:fs';
import cliProgress from 'cli-progress';
import pc from 'picocolors';
import { mkDir, makeComponentFilename, makeComponentName, capitalizeFirstLetter } from './utils.js';

type Icon = {
	svgFile: string;
	name: string;
	component: string;
	componentFile: string;
	componentFolder: string;
	data?: Record<string, string | number>[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const ICONS_OUTPUT_FOLDER = join(__dirname, '..', '..', 'src', 'lib', 'icons');

let counter = 0;

// create a new progress bar instance with the shades_classic theme.
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);

// ----------------------------------------------------------------

async function main() {
	await mkDir(ICONS_OUTPUT_FOLDER);

	console.log(pc.blue('* Getting list of all icons...'));
	const files = await fsp.readdir(INPUT_FOLDER);
	const iconObjs = await makeIconObjsList(files);

	console.log(pc.blue('* Generating folders tree...'));
	await generateFolderTree(ICONS_OUTPUT_FOLDER, iconObjs);

	console.log(pc.blue('* Generating icon components...\n'));
	await generateIconsDataset(INPUT_FOLDER, ICONS_OUTPUT_FOLDER, iconObjs);
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
async function makeIconObjsList(files: string[]): Promise<Icon[]> {
	return files.reduce((acc: Icon[], curr: string) => {
		const svgFile = curr;
		const name = curr.split('.').slice(0, -1).join('.');
		const componentFolder = name;
		const component = makeComponentName(name);
		const componentFile = makeComponentFilename(component);

		acc.push({
			svgFile,
			name,
			component,
			componentFile,
			componentFolder
		} satisfies Icon);
		return acc;
	}, [] as Icon[]);
}

/**
 * It takes an array of icon objects and creates a folder for each icon in the iconsOutputFolder.
 *
 * @param {string} iconsOutputFolder - The folder where a folder for each icon will be generated.
 * @param {Icon[]} icons  - this is the array of icon objects.
 */
async function generateFolderTree(iconsOutputFolder: string, icons: Icon[]): Promise<void> {
	icons.map(async (icon) => {
		await mkDir(join(iconsOutputFolder, icon.componentFolder));
	});
}

/**
 * It reads the SVG file, parses it, extracts the data, generates the Svelte component, generates
 * the index.ts and index.d.ts files, and appends an entry to the index.ts file.
 *
 * @param {string} inputFolder - the folder where the original SVG files are located
 * @param {string} iconsOutputFolder - the folder where the generated icon components will be stored
 * @param {string} indexFile - the path to the index.ts file
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

	icons.map(async (icon) => {
		const iconData = await fsp.readFile(join(inputFolder, icon.svgFile), 'utf8');
		const parsed = parse(iconData.toString());
		parsed.children.forEach((item) => {
			if ((item as ElementNode).children === undefined) return;

			icon.data = [];
			(item as ElementNode).children.forEach(function (child) {
				if ((child as ElementNode).properties === undefined) return;

				const c = child as ElementNode;
				if (icon.data != undefined && child != undefined && c.properties != undefined) {
					icon.data.push(c.properties);
				}
			});
		});

		counter++;

		// generate svelte component for each icon
		await makeIconComponent(iconsOutputFolder, icon);
		// generate index.ts and index.d.ts files for each icon
		await makeIconComponentIndex(iconsOutputFolder, icon);
		// append an entry to index.ts file
		await appendToIndexTs(icon);

		progressBar.stop();
	});
}

/**
 * It takes an icon object and writes a Svelte component file to the output folder.
 *
 * @param {string} outputFolder - The folder to output the icon components to.
 * @param {Icon} iconObj - The icon object from the icons.json file
 */
async function makeIconComponent(outputFolder: string, iconObj: Icon): Promise<void> {
	progressBar.update(counter, {
		filename: `${iconObj.componentFile}`
	});

	const txt = `<script lang="ts">

	export let size: IconSize | string | number = 'base'
	export let altText = '${capitalizeFirstLetter(iconObj.name)} icon';

	const sizeMap = {
		'sm': '0.875rem',
		'base': '1rem',
		'lg': '1.125rem',
		'xl': '1.25rem',
		'2xl': '1.5rem'
	};

	type IconSize = keyof typeof sizeMap;

	const defaultSize = '1rem';

	$: _size = () => {
		if (typeof size === 'string' && size in sizeMap) return sizeMap[size as unknown as IconSize];

		if (typeof size === 'number' || typeof size === 'string') return size;

		return defaultSize;
	};
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={_size()}
	height={_size()}
	fill="none"
	stroke-width="1.5"
	viewBox="0 0 24 24"
	aria-hidden="true"
	aria-labelledby={altText}
	on:click
	on:dblclick
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
	{...$$restProps}
>
    ${buildIconDataString(iconObj).join(' ')}
</svg>`;

	await fsp.writeFile(join(outputFolder, iconObj.componentFolder, iconObj.componentFile), txt);
}

/**
 * It writes a file called `index.ts` in the folder for each icon, which exports the icon component.
 *
 * @param {string} outputFolder - The folder where the icon component will be created.
 * @param {Icon} iconObj - The icon object from the icons.json file.
 */
async function makeIconComponentIndex(outputFolder: string, iconObj: Icon): Promise<void> {
	const txt = `export { default as ${iconObj.component} } from './${iconObj.componentFile}';`;

	await fsp.writeFile(join(outputFolder, iconObj.componentFolder, 'index.ts'), txt);
}

/**
 * It takes an Icon object and returns an array of strings.
 *
 * @param {Icon} icon - Icon - The icon object that we're building the SVG string for.
 *
 * @returns An array of strings.
 */
function buildIconDataString(icon: Icon): string[] {
	// <path (key="value"...)/>
	if (icon.data != undefined) {
		return icon.data.map(
			(item) =>
				`<path ${Object.entries(item)
					.map(([key, value]) => `${key}="${value}" `)
					.join('')}/>`
		);
	}
	return [];
}

/**
 * It takes a filename and an icon object, and appends an export entry to the file.
 *
 * @param {string} filename - The name of the file to append to.
 * @param {Icon} iconObj - The icon object from the JSON file.
 */
async function appendToIndexTs(iconObj: Icon): Promise<void> {
	const indexFile = join(__dirname, '..', '..', 'src', 'lib', 'index.ts');
	const exportString = makeExportEntryString(iconObj);

	progressBar.update(counter, {
		filename: `${iconObj.componentFile}`
	});

	await fsp.appendFile(indexFile, exportString);
}

function makeExportEntryString(iconObj: Icon): string {
	return `export { ${iconObj.component} } from './icons/${iconObj.componentFolder}/index.js';\n`;
}

// ----------------------------------------------------------------

await main();
