import type { Nodes } from 'hast-util-to-html/lib/index.js';
import type { SvelteHTMLElements } from 'svelte/elements';
import { ICON_SIZE_MAP } from './constants.js';

/**
 * Valid size keys in ICON_SIZE_MAP.
 */
export type IconSizeMap = typeof ICON_SIZE_MAP;
export type IconSize = keyof IconSizeMap;

/**
 * A valid icon size can be a predefined label, string, or numeric pixel value.
 */
export type IconSizeProp = IconSize | string | number;

/**
 * Variant of the icon: 'regular' or 'solid'.
 */
export type IconVariant = 'regular' | 'solid';

/**
 * Metadata for an icon, used during JSON or dataset generation.
 */
export type Icon = {
	svgFile: string;
	name: string;
	variant: IconVariant;
	data?: Nodes;
};

/**
 * Internal shared props for <IconoirBase> and icon components.
 */
export interface SVGProps extends SvelteHTMLElements['svg'] {
	name?: string;
	size?: IconSizeProp;
	altText?: string;
	svg?: string; // Injected raw SVG (used by dynamic <Iconoir />)
	interactive?: boolean;
}
