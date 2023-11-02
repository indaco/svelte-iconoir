import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import pc from 'picocolors';

// ----------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LIB_FOLDER = join(__dirname, '..', '..', 'src', 'lib');
const ICONS_FOLDER = join(LIB_FOLDER, 'icons');

// ----------------------------------------------------------------

const removeLibFolder = async () => {
	try {
		await fs.rm(ICONS_FOLDER, { recursive: true, force: true });
		console.log(pc.blue('* Successfully removed previously generated components.'));
	} catch (err) {
		console.error(err);
		console.log(pc.magenta('* Lib folder not found -- nothing to delete!'));
	}
};

removeLibFolder();
