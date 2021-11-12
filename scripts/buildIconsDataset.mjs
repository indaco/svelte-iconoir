import pkg from 'svg-parser';
const { parse } = pkg;
import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

const INPUT_FOLDER = join(__dirname, '..', 'packages', 'iconoir', 'icons');
const ICONS_OUTPUT_FOLDER = join(__dirname, '..', 'iconoir');
const DIST_FOLDER = join(__dirname, '..', 'dist');
const INDEX_FILE = join(__dirname, '..', 'src', 'index.js');

let counter = 0;

// ----------------------------------------------------------------

function main() {
	resetAll(INDEX_FILE, ICONS_OUTPUT_FOLDER, DIST_FOLDER);
	makeDir(ICONS_OUTPUT_FOLDER);
	generateIconsDataset();
	console.info('\nIcons counter = ' + counter + '\n');
}

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
		counter++;
		// write JSON string to a file
		saveIconData(filename, JSON.stringify(icon));
		// append an entry to index.js file
		appendToExports(filename);
	});
	appendIconoirEntryToExports();
}

function saveIconData(filename, jsonString) {
	console.info('\n* Saving ' + filename + '.json to ' + ICONS_OUTPUT_FOLDER);
	fs.writeFileSync(join(ICONS_OUTPUT_FOLDER, filename + '.json'), jsonString, (err) => {
		if (err) {
			throw err;
		}
	});
}

function appendToExports(filename) {
	const iconFilename = _makeIconNameString(filename);
	const exportString = _makeExportEntryString(filename, iconFilename);

	//console.log('"./iconoir/' + filename + '.json":"./iconoir/' + filename + '.json",');
	console.info('* Add ' + iconFilename + ' as entry to the module exports.');
	fs.appendFileSync(INDEX_FILE, exportString, (err) => {
		if (err) {
			throw err;
		}
	});
}

function appendIconoirEntryToExports() {
	const exportString = `import Iconoir from './Iconoir.svelte';
export default Iconoir; `;
	console.info('\n* Add Iconoir component as entry to the module exports.');
	fs.appendFileSync(INDEX_FILE, exportString, (err) => {
		if (err) {
			throw err;
		}
	});
}

// ----------------------------------------------------------------

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
			return 'Medal1st';
			break;
		case '360View':
			return 'View360';
			break;
		case '4kDisplay':
			return 'Display4k';
			break;
		case '4x4Cell':
			return 'Cell4x4';
			break;
		case 'github':
			return 'GitHub';
		case 'githubOutline':
			return 'GitHubOutline';
		case 'gitlabFull':
			return 'GitLabFull';
		case 'linkedin':
			return 'LinkedIn';
		case 'tiktok':
			return 'TikTok';
		case 'youtube':
			return 'YouTube';
		default:
			return _capitalizeFirstLetter(camelCase);
			break;
	}
}

function _makeExportEntryString(filename, iconFilename) {
	return (
		'export { default as ' + iconFilename + " } from '../iconoir/" + filename + ".json';\r\n"
	);
}

// ----------------------------------------------------------------

main();
