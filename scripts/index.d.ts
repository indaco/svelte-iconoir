export type IconVariant = 'regular' | 'solid';

export type Icon = {
	svgFile: string;
	name: string;
	variant: IconVariant;
	component: string;
	componentFile: string;
	componentFolder: string;
	data?: string;
};

export type SvelteComponentExportItem = {
	types: string;
	svelte: string;
	default: string;
};

export type PkgExports = {
	[key: string]: string | SvelteComponentExportItem;
};

export type PkgTypesVersions = {
	[key: string]: Record<string, string[]>;
};
