import type { ElementNode } from 'svg-parser';
import { parse } from 'svg-parser';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import cliProgress from 'cli-progress';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

interface Icon {
	name: string;
	data?: Record<string, string | number>[];
}

// ----------------------------------------------------------------

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const LIB_FOLDER = join(__dirname, '..', '..', 'src', 'lib');
const ICONS_OUTPUT_FOLDER = join(LIB_FOLDER, 'icons');
const INDEX_FILE = join(__dirname, '..', '..', 'src', 'lib', 'index.ts');

let counter = 0;

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);

// ----------------------------------------------------------------

async function main() {
	await makeDir(LIB_FOLDER);
	await makeDir(ICONS_OUTPUT_FOLDER);

	console.log('\n* Getting list of all icons...');
	const files = await fs.readdir(INPUT_FOLDER);

	console.log('\n* Generating folders tree...');
	await generateFolderTree(files);

	console.log('\n* Generating icon components...\n');
	await generateIconsDataset(files);
}

async function generateFolderTree(files: string[]) {
	files.forEach(async (file) => {
		const filename = file.split('.').slice(0, -1).join('.');

		await makeDir(join(ICONS_OUTPUT_FOLDER, _makeIconNameString(filename)));
	});
}

async function generateIconsDataset(files: string[]) {
	progressBar.start(files.length, 0, {
		filename: 'N/A'
	});

	files.forEach(async (file) => {
		const iconData = await fs.readFile(join(INPUT_FOLDER, file), 'utf8');
		const parsed = parse(iconData.toString());

		const filename = file.split('.').slice(0, -1).join('.');
		const icon: Icon = {
			name: filename
		};

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
		await makeIconComponent(ICONS_OUTPUT_FOLDER, icon);
		// generate index.ts and index.d.ts files for each icon
		await makeIconComponentIndex(ICONS_OUTPUT_FOLDER, icon);
		// append an entry to index.ts file
		await appendToExports(INDEX_FILE, icon);

		progressBar.stop();
	});
}

async function makeIconComponent(outputFolder: string, iconObj: Icon) {
	const iconFilename = _makeIconNameString(iconObj.name);

	progressBar.update(counter, {
		filename: `${iconFilename}.svelte`
	});

	const txt = `<script>
	export let altText = '${iconObj.name} icon';
	export let size = '1.5em';
	export let color = '';
	$: fillColor = color != '' ? color : 'none'
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	stroke-width={1.5}
	viewBox="0 0 24 24"
	fill={fillColor}
	aria-hidden="true"
	aria-labelledby={altText}
	class={$$props.class}
	style={$$props.style}
	on:click
	on:dblclick
>${buildIconDataString(iconObj).join(' ')}</svg>`;

	await fs.writeFile(join(outputFolder, iconFilename, iconFilename + '.svelte'), txt);
}

async function makeIconComponentIndex(outputFolder: string, iconObj: Icon) {
	const iconFilename = _makeIconNameString(iconObj.name);
	const txt = `import ${iconFilename} from './${iconFilename}.svelte';
	export { ${iconFilename} };
	`;

	await fs.writeFile(join(outputFolder, iconFilename, 'index.ts'), txt);
}

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

async function appendToExports(filename: string, iconObj: Icon) {
	const iconFilename = _makeIconNameString(iconObj.name);
	const exportString = _makeExportEntryString(iconFilename);

	progressBar.update(counter, {
		filename: `${iconFilename}.svelte`
	});

	await fs.appendFile(filename, exportString);
}

// ----------------------------------------------------------------

function _toCamelCase(str: string) {
	const text = str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
	return text.replaceAll(/ /g, '');
}

function _capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function _makeIconNameString(filename: string) {
	const camelCase = _toCamelCase(filename);

	switch (camelCase) {
		case '1stMedal':
			return 'Medal1stIcon';
		case '360View':
			return 'View360Icon';
		case '3dSelectEdge':
			return 'SelectEdge3DIcon';
		case '3dSelectFace':
			return 'SelectFace3DIcon';
		case '3dSelectPoint':
			return 'SelectPoint3DIcon';
		case '3dSelectSolid':
			return 'SelectSolid3DIcon';
		case '3dAddHole':
			return 'AddHole3DIcon';
		case '3dArcCenterPt':
			return 'ArcCenterPt3DIcon';
		case '3dArc':
			return 'Arc3DIcon';
		case '3dCenterBox':
			return 'CenterBox3DIcon';
		case '3dBridge':
			return 'Bridge3DIcon';
		case '3dEllipse':
			return 'Ellipse3DIcon';
		case '3dPtBox':
			return 'PtBox3DIcon';
		case '3dRectCornerToCorner':
			return 'RectCornerToCorner3DIcon';
		case '3dEllipseThreePts':
			return 'EllipseThreePts3DIcon';
		case '3dRectFromCenter':
			return 'RectFromCenter3DIcon';
		case '3dThreePtsBox':
			return 'ThreePtsBoxeDIcon';
		case '3dRectThreePts':
			return 'RectThreePts3DIcon';
		case '2x2Cell':
			return 'Cell2x2Icon';
		case '4kDisplay':
			return 'Display4kIcon';
		case '4x4Cell':
			return 'Cell4x4Icon';
		case 'github':
			return 'GitHubIcon';
		case 'githubOutline':
			return 'GitHubOutlineIcon';
		case 'gitlabFull':
			return 'GitLabFullIcon';
		case 'linkedin':
			return 'LinkedInIcon';
		case 'tiktok':
			return 'TikTokIcon';
		case 'youtube':
			return 'YouTubeIcon';
		default:
			return _capitalizeFirstLetter(camelCase) + 'Icon';
	}
}

function _makeExportEntryString(iconFilename: string) {
	return `export { ${iconFilename} } from './icons/${iconFilename}/index.js';\n`;
}

// ----------------------------------------------------------------

async function makeDir(pathToDir: string) {
	fs.mkdir(pathToDir, { recursive: true });
}

// ----------------------------------------------------------------

await main();
