import type { Icon } from './index.d.ts';
import { join } from 'node:path';
import { promises as fsp } from 'node:fs';

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function mkDir(pathToDir: string, recursive = true) {
	await fsp.mkdir(pathToDir, { recursive });
}

export function relativePath(path: string) {
	return `./${path}`;
}

export function makeComponentName(filename: string) {
	const specialCases: Record<string, string> = {
		github: 'GitHubIcon',
		githubCircle: 'GitHubCircleIcon',
		gitlabFull: 'GitLabFullIcon',
		linkedin: 'LinkedInIcon',
		tiktok: 'TikTokIcon',
		youtube: 'YouTubeIcon'
	};

	const specialCase = specialCases[toCamelCase(filename)];
	return specialCase ? specialCase : `${toPascalCase(filename)}Icon`;
}

export function makeComponentFilename(component: string): string {
	return component.concat('.svelte');
}

export function makeComponentDTSFilename(component: string): string {
	return makeComponentFilename(component).concat('.d.ts');
}

/**
 * It writes a file called `index.ts` in the folder for each icon, which exports the icon component.
 *
 * @param {string} outputFolder - The folder where the icon component will be created.
 * @param {Icon} iconObj - The icon object from the icons.json file.
 */
export async function generateIconComponentIndex(
	outputFolder: string,
	iconObj: Icon
): Promise<void> {
	const txt = `export { default as ${iconObj.component} } from './${iconObj.componentFile}';`;

	await fsp.writeFile(join(outputFolder, iconObj.componentFolder, 'index.ts'), txt);
}

export function generateExportEntryString(iconObj: Icon): string {
	return `export { ${iconObj.component} } from './${iconObj.componentFolder}/index.js';\n`;
}

// ----------------------------------------------------------------

function toPascalCase(str: string) {
	const text = str.replace(/(?:^|-)([a-z0-9])/g, (_, char) => char.toUpperCase());
	return text.replace(/ /g, '');
}

function toCamelCase(str: string) {
	const text = str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
	return text.replaceAll(/ /g, '');
}
