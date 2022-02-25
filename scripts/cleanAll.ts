import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------------------------------------------------

const LIB_FOLDER = join(__dirname, '..', '..', 'src', 'lib');

// ----------------------------------------------------------------

const fileExists = async (path: string) => !!(await fs.stat(path).catch(_ => false));

async function main() {
	if (await fileExists(LIB_FOLDER)) {
		console.log(`Removing lib folder...`);
		try {
			await fs.rm(LIB_FOLDER, { recursive: true, force: true });
		} catch (err) {
			console.error(err);
		}
	} else {
		console.log('Lib folder not found -- nothing to delete.');
	}
}

main();
