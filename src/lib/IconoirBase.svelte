<script lang="ts">
	import { ICON_SIZE_MAP } from './constants.js';
	import type { IconSize, SVGProps } from './Icon.d.ts';

	const sizeMap = ICON_SIZE_MAP;

	/** The name of the icon to render (e.g. "zoom-out") */
	export let name: SVGProps['name'] = undefined;

	/** Accessible label (defaults to `${name} icon`) */
	export let altText: SVGProps['altText'] = undefined;

	/** Icon size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | number | string */
	export let size: SVGProps['size'] = 'base';

	export let svg: SVGProps['svg'] = undefined;

	/**
	 * Enables pointer cursor styling when interactive behavior is expected.
	 *
	 * Set to `true` if the icon has event listeners like `on:click` or `on:mouseenter`
	 * to visually indicate interactivity (e.g., `cursor: pointer`).
	 *
	 * @default false
	 */
	export let interactive: SVGProps['interactive'] = false;

	const defaultSize = sizeMap.base;

	let _altText = altText ?? `${name} icon`;

	let _size =
		size && size in sizeMap
			? sizeMap[size as IconSize]
			: typeof size === 'number' || typeof size === 'string'
				? size
				: defaultSize;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={_size}
	height={_size}
	fill="none"
	stroke-width="1.5"
	viewBox="0 0 24 24"
	style={interactive ? 'cursor: pointer' : undefined}
	aria-hidden="true"
	aria-labelledby={_altText}
	{...$$restProps}
	on:click
	on:dblclick
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
>
	{#if svg}
		<g>{@html svg}</g>
	{:else}
		<slot />
	{/if}
</svg>
