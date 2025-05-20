import type { IconVariant } from './index.d.ts';
import { parse, type ElementNode, type RootNode } from 'svg-parser';
import { toHtml } from 'hast-util-to-html';
import { fileURLToPath } from 'node:url';
import { join, dirname, basename } from 'node:path';
import { promises as fsp } from 'node:fs';
import pc from 'picocolors';
import cliProgress from 'cli-progress';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FOLDER = join(__dirname, '..', '..', 'packages', 'iconoir', 'icons');
const OUTPUT_FOLDER = join(__dirname, '..', '..', 'src', 'lib', 'icons');

const VARIANTS: IconVariant[] = ['regular', 'solid'];

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);

async function main() {
	for (const variant of VARIANTS) {
		const inputDir = join(INPUT_FOLDER, variant);
		const outputFile = join(OUTPUT_FOLDER, variant, 'icons.json');
		await fsp.mkdir(dirname(outputFile), { recursive: true });

		const files = await fsp.readdir(inputDir);
		const entries: Record<string, string> = {};

		console.log(pc.blue(`* Generating ${variant}/icons.json`));
		progressBar.start(files.length, 0);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const name = file.replace(/\.svg$/, '');
			const svgRaw = await fsp.readFile(join(inputDir, file), 'utf8');
			const ast = parse(svgRaw) as RootNode;
			const svgEl = ast.children[0] as ElementNode;

			// // Inject stroke="currentColor" if missing
			// for (const child of svgEl.children as ElementNode[]) {
			// 	if (child.type === 'element' && child.tagName === 'path') {
			// 		child.properties ||= {};
			// 		if (!('stroke' in child.properties)) {
			// 			child.properties.stroke = 'currentColor';
			// 		}
			// 	}
			// }

			entries[name] = toHtml(svgEl.children as any);
			progressBar.update(i + 1);
		}

		progressBar.stop();
		await fsp.writeFile(outputFile, JSON.stringify(entries, null, 2));
		console.log(pc.green(pc.bold(`✔ Wrote ${variant}/icons.json`)));
	}
}

main();
