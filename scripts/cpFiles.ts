import { fileURLToPath } from 'node:url';
import { copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceDir = join(__dirname, '..', '..');
const distDir = join(sourceDir, 'dist');

console.log(pc.blue('* Copying README.md and LICENSE to the dist folder...'));

const filesToCopy = ['README.md', 'LICENSE'];

filesToCopy.forEach((file) => {
	copyFileSync(join(sourceDir, file), join(distDir, file));
});

console.log(pc.green(pc.bold('* Done!\n')));
