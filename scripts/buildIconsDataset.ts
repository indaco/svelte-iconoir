import type { Nodes } from 'hast-util-to-html/lib/index.js';
import { toHtml } from 'hast-util-to-html';
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
	data?: string;
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
	const files = await fsp.readdir(INPUT_FOLDER, 'utf-8');
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
	import type { SVGAttributes } from 'svelte/elements';

	const sizeMap = {
		sm: '0.875rem',
		base: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem'
	};

	type IconSize = keyof typeof sizeMap;

	interface $$Props extends SVGAttributes<SVGElement> {
		size?: IconSize | string | number;
		altText?: string;
	}

	export let altText = $$props.altText ?? '${capitalizeFirstLetter(iconObj.name)} icon';

	const defaultSize = sizeMap['base'];

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
