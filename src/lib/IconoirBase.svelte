<script lang="ts">
	import type { IconSize, IconSizeMap, SVGProps } from './Icon.d.ts';

	const sizeMap = {
		xs: '1em',
		sm: '1.25em',
		base: '1.5em',
		lg: '1.75em',
		xl: '2em'
	} satisfies IconSizeMap;

	interface $$Props extends SVGProps {}

	export let name: $$Props['name'] = undefined;
	export let altText: $$Props['altText'] = undefined;
	export let size: $$Props['size'] = 'base';

	const defaultSize = sizeMap['base'];

	let _altText = altText ?? `${name} icon`;

	let _size =
		size && size in sizeMap
			? sizeMap[size as unknown as IconSize]
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
	<slot />
</svg>
