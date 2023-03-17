import { fileURLToPath } from 'node:url';
import { copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(pc.blue('* Copying README.md to the dist folder...'));
copyFileSync(
	join(__dirname, '..', '..', 'README.md'),
	join(__dirname, '..', '..', 'dist', 'README.md')
);

console.log(pc.blue('* Copying LICENSE to the dist folder...'));
copyFileSync(
	join(__dirname, '..', '..', 'LICENSE'),
	join(__dirname, '..', '..', 'dist', 'LICENSE')
);

console.log(pc.green(pc.bold('* Done!\n')));
