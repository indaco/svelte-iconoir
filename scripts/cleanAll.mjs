import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

const ICONS_OUTPUT_FOLDER = join(__dirname, '..', 'src', 'lib', 'iconoir');
const DIST_FOLDER = join(__dirname, '..', 'dist');
const INDEX_FILE = join(__dirname, '..', 'src', 'lib', 'index.ts');

// ----------------------------------------------------------------

function main() {
	resetAll(INDEX_FILE, ICONS_OUTPUT_FOLDER, DIST_FOLDER);
}

function resetAll(indexFilepath, outputFolder, distFolder) {
	_removeIndexFile(indexFilepath);
	_removeFolder(outputFolder);
	_removeFolder(distFolder);
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
		console.log('File not found, nothing to delete.');
	}
}

function _removeFolder(pathToFolder) {
	if (fs.existsSync(pathToFolder)) {
		console.log('Folder ' + pathToFolder + ' exists. Deleting now...');
		fs.rmSync(pathToFolder, { recursive: true, force: true });
	}
}

// ----------------------------------------------------------------

main();
