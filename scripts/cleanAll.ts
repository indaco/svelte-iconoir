import { promises as fs, constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import pc from 'picocolors';

// ----------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LIB_FOLDER = join(__dirname, '..', '..', 'src', 'lib');

// ----------------------------------------------------------------

const fileExists = async (path: string) =>
	fs
		.access(path, constants.R_OK)
		.then(() => true)
		.catch(() => false);

if (await fileExists(LIB_FOLDER)) {
	console.log(pc.blue('* Removing previously generated components...'));
	try {
		await fs.rm(LIB_FOLDER, { recursive: true, force: true });
	} catch (err) {
		console.error(err);
	}
} else {
	console.log(pc.magenta('* Lib folder not found -- nothing to delete!'));
}
