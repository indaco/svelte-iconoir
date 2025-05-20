import { fileURLToPath } from 'node:url';
import { copyFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceDir = join(__dirname, '..', '..');
const distDir = join(sourceDir, 'dist');

console.log(pc.blue('* Copying static files to dist/...'));

const filesToCopy = [
	'README.md',
	'LICENSE',
	join('src', 'lib', 'Icon.d.ts'),
	join('src', 'lib', 'IconoirBase.svelte')
];

filesToCopy.forEach((relativePath) => {
	const sourcePath = join(sourceDir, relativePath);
	const destPath = join(distDir, basename(relativePath)); // flatten!

	copyFileSync(sourcePath, destPath);
});

console.log(pc.green(pc.bold('* Done!\n')));
