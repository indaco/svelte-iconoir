import type { Nodes } from 'hast-util-to-html/lib/index.js';
import type { SvelteHTMLElements } from 'svelte/elements';

type IconSizeMap = {
	xs: string;
	sm: string;
	base: string;
	lg: string;
	xl: string;
};

type IconSize = keyof IconSizeMap;

export type IconVariant = 'regular' | 'solid';

export type Icon = {
	svgFile: string;
	name: string;
	variant: IconVariant;
	data?: Nodes;
};

type SVGRestProps = SvelteHTMLElements['svg'];

interface SVGPropsInternal extends SVGRestProps {
	name: string;
	size: IconSize | string | number;
	altText?: string;
}

export type SVGProps = SVGPropsInternal & SvelteHTMLElements['svg'];
