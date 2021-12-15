import pkg from 'svg-parser';
const { parse } = pkg;
import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

const INPUT_FOLDER = join(__dirname, '..', 'packages', 'iconoir', 'icons');
const LIB_FOLDER = join(__dirname, '..', 'src', 'lib');
const ICONS_OUTPUT_FOLDER = join(LIB_FOLDER, 'iconoir');
const INDEX_FILE = join(__dirname, '..', 'src', 'lib', 'index.ts');
const DIST_FOLDER = join(__dirname, '..', 'dist');

let counter = 0;

// ----------------------------------------------------------------

function main() {
	resetAll(INDEX_FILE, ICONS_OUTPUT_FOLDER, DIST_FOLDER);
	makeDir(LIB_FOLDER);
	makeDir(ICONS_OUTPUT_FOLDER);
	generateIconsDataset();
	console.info('\nIcons counter = ' + counter + '\n');
}

function generateIconsDataset() {
	fs.readdirSync(INPUT_FOLDER).forEach((file) => {
		const filename = file.split('.').slice(0, -1).join('.');
		const iconData = fs.readFileSync(join(INPUT_FOLDER, file), 'utf8').toString();
		const parsed = parse(iconData);
		var icon = {};
		icon['name'] = filename;
		parsed.children.forEach(function (item) {
			icon['data'] = [];
			item.children.forEach(function (child) {
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
	console.info('\n* Saving ' + iconFilename + '.svelte to ' + outputFolder);

	let txt =
		`
<script>
	let altText = '` +
		iconObj.name +
		` icon';
	export let size = '1.5em';
	export let color = 'currentColor';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	stroke-width={1.5}
	viewBox="0 0 24 24"
	fill="none"
	{color}
	aria-hidden="true"
	aria-labelledby={altText}
	class={$$props.class}
	style={$$props.style}
>` +
		buildIconDataString(iconObj.data).join(' ') +
		`</svg>`;

	fs.writeFileSync(join(outputFolder, iconFilename + '.svelte'), txt, (err) => {
		if (err) {
			throw err;
		}
	});
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

function appendToExports(filename) {
	const iconFilename = _makeIconNameString(filename);
	const exportString = _makeExportEntryString(iconFilename);

	console.info('* Add ' + iconFilename + ' as entry to the module exports.');
	fs.appendFileSync(INDEX_FILE, exportString, (err) => {
		if (err) {
			throw err;
		}
	});
}

// ----------------------------------------------------------------

function _toCamelCase(myStr) {
	let text = myStr.replace(/-([a-z0-9])/g, function (g) {
		return g[1].toUpperCase();
	});
	return text.replaceAll(/ /g, '');
}

function _capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function _makeIconNameString(filename) {
	const camelCase = _toCamelCase(filename);

	switch (camelCase) {
		case '1stMedal':
			return 'Medal1stIcon';
			break;
		case '360View':
			return 'View360Icon';
			break;
		case '4kDisplay':
			return 'Display4kIcon';
			break;
		case '4x4Cell':
			return 'Cell4x4Icon';
			break;
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
			break;
	}
}

function _makeExportEntryString(iconFilename) {
	return (
		`
	import ` +
		iconFilename +
		` from './iconoir/` +
		iconFilename +
		`.svelte';
	export {` +
		iconFilename +
		`};
	`
	);
}

// ----------------------------------------------------------------
function resetAll(indexFilepath, outputFolder, distFolder) {
	_removeIndexFile(indexFilepath);
	_removeFolder(outputFolder);
	_removeFolder(distFolder);
}

function makeDir(pathToDir) {
	if (!fs.existsSync(pathToDir)) {
		fs.mkdirSync(pathToDir);
	}
}

function _removeIndexFile(filePath) {
	if (fs.existsSync(filePath)) {
		console.log('File exists. Deleting now ...');
		try {
			fs.rmSync(filePath, { force: true });
		} catch (err) {
			console.error(err);
		}
	} else {
		console.log('File not found, so not deleting.');
	}
}

function _removeFolder(pathToFolder) {
	if (fs.existsSync(pathToFolder)) {
		fs.rmSync(pathToFolder, { recursive: true, force: true });
	}
}

// ----------------------------------------------------------------

main();
