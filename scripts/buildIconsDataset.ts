import { parse } from 'svg-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cliProgress from "cli-progress"
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const LIB_FOLDER = join(__dirname, '..', '..', 'src', 'lib');
const ICONS_OUTPUT_FOLDER = join(LIB_FOLDER, 'icons');
const INDEX_FILE = join(__dirname, '..', '..', 'src', 'lib', 'index.ts');

let counter = 0;

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const files = fs.readdirSync(INPUT_FOLDER)

// ----------------------------------------------------------------

function main() {
	makeDir(LIB_FOLDER);
	makeDir(ICONS_OUTPUT_FOLDER);

	console.log("\nGenerating files...")

	progressBar.start(files.length, 0, {
		filename: "N/A"
	})

	generateIconsDataset();
	progressBar.stop();
}

function generateIconsDataset() {
	fs.readdirSync(INPUT_FOLDER).forEach((file) => {
		const filename = file.split('.').slice(0, -1).join('.');
		const iconData = fs.readFileSync(join(INPUT_FOLDER, file), 'utf8').toString();
		const parsed = parse(iconData);
		let icon = {
			name: filename
		};

		parsed.children.forEach(function (item) {
			icon['data'] = [];
			item["children"].forEach(function (child) {
				icon['data'].push(child.properties);
			});
		});
		// generate svelte component for each icon
		makeIconComponent(ICONS_OUTPUT_FOLDER, icon);
		// append an entry to index.js file
		appendToExports(filename);
		counter++;
	});
}

function makeIconComponent(outputFolder, iconObj) {
	const iconFilename = _makeIconNameString(iconObj.name);
	progressBar.update(counter + 1, {
		filename: `${iconFilename}.svelte`
	})

	let txt =`<script>
	let altText = '${iconObj.name} icon';
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
>${buildIconDataString(iconObj.data).join(' ')}</svg>`;

	fs.writeFileSync(join(outputFolder, iconFilename + '.svelte'), txt);
}

function buildIconDataString(iconData) {
	let data = [];
	iconData.forEach((item) => {
		let path = '<path ';
		Object.entries(item).forEach(([key, value]) => {
			path += `${key}="${value}" `;
		});
		path += '/>';
		data.push(path);
	});
	return data;
}

function appendToExports(filename: string) {
	const iconFilename = _makeIconNameString(filename);
	const exportString = _makeExportEntryString(iconFilename);

	progressBar.update(counter + 1, {
		filename: `${iconFilename}.svelte`
	})
	fs.appendFileSync(INDEX_FILE, exportString);
}

// ----------------------------------------------------------------

function _toCamelCase(str: string) {
	let text = str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
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
	return `export { default as ${iconFilename} } from './icons/${iconFilename}.svelte';\n`;
}

// ----------------------------------------------------------------

function makeDir(pathToDir: string) {
	if (!fs.existsSync(pathToDir)) {
		fs.mkdirSync(pathToDir);
	}
}

// ----------------------------------------------------------------

main();
