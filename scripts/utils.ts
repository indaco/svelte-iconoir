import { promises as fsp } from 'node:fs';

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function mkDir(pathToDir: string, recursive: boolean = true) {
	fsp.mkdir(pathToDir, { recursive: recursive });
}

export function relativePath(path: string) {
	return './'.concat(path);
}

export function makeComponentName(filename: string) {
	const camelCase = toCamelCase(filename);

	switch (camelCase) {
		case '1stMedal':
			return 'Medal1stIcon';
		case '2x2Cell':
			return 'Cell2x2Icon';
		case '3dAddHole':
			return 'AddHole3dIcon';
		case '3dArcCenterPt':
			return 'ArcCenterPt3dIcon';
		case '3dArc':
			return 'Arc3dIcon';
		case '3dBridge':
			return 'Bridge3dIcon';
		case '3dCenterBox':
			return 'CenterBox3dIcon';
		case '3dEllipseThreePts':
			return 'EllipseThreePts3dIcon';
		case '3dEllipse':
			return 'Ellipse3dIcon';
		case '3dPtBox':
			return 'PtBox3dIcon';
		case '3dRectCornerToCorner':
			return 'RectCornerToCorner3dIcon';
		case '3dRectFromCenter':
			return 'RectFromCenter3dIcon';
		case '3dRectThreePts':
			return 'RectThreePts3dIcon';
		case '3dSelectEdge':
			return 'SelectEdge3dIcon';
		case '3dSelectFace':
			return 'SelectFace3dIcon';
		case '3dSelectPoint':
			return 'SelectPoint3dIcon';
		case '3dSelectSolid':
			return 'SelectSolid3dIcon';
		case '3dThreePtsBox':
			return 'ThreePtsBoxe3dIcon';
		case '4kDisplay':
			return 'Display4kIcon';
		case '360View':
			return 'View360Icon';
		case 'github':
			return 'GitHubIcon';
		case 'githubCircle':
			return 'GitHubCircleIcon';
		case 'gitlabFull':
			return 'GitLabFullIcon';
		case 'linkedin':
			return 'LinkedInIcon';
		case 'tiktok':
			return 'TikTokIcon';
		case 'youtube':
			return 'YouTubeIcon';
		default:
			return capitalizeFirstLetter(camelCase) + 'Icon';
	}
}

export function makeComponentFilename(component: string): string {
	return component.concat('.svelte');
}

export function makeComponentDTSFilename(component: string): string {
	return makeComponentFilename(component).concat('.d.ts');
}

// ----------------------------------------------------------------

function toCamelCase(str: string) {
	const text = str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
	return text.replaceAll(/ /g, '');
}
