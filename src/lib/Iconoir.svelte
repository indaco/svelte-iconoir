<script lang="ts">
	import type { IconVariant, SVGProps } from './Icon.d.ts';
	import IconoirBase from './IconoirBase.svelte';

	/** The name of the icon to render (e.g. "zoom-out") */
	export let name: string;

	/** Icon variant: 'regular' (default) or 'solid' */
	export let variant: IconVariant = 'regular';

	/** Accessible label (defaults to `${name} icon`) */
	export let altText: SVGProps['altText'] = undefined;

	/** Icon size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | number | string */
	export let size: SVGProps['size'] = 'base';

	/**
	 * Enables pointer cursor styling when interactive behavior is expected.
	 *
	 * Set to `true` if the icon has event listeners like `on:click` or `on:mouseenter`
	 * to visually indicate interactivity (e.g., `cursor: pointer`).
	 *
	 * @default false
	 */
	export let interactive: SVGProps['interactive'] = false;

	const iconGlobs = {
		regular: import.meta.glob('./icons/regular/icons.json'),
		solid: import.meta.glob('./icons/solid/icons.json')
	};

	const iconCache: Record<IconVariant, Map<string, string> | null> = {
		regular: null,
		solid: null
	};

	let svg: string | undefined;

	$: loadIcon(name, variant);

	async function loadIcon(name: string, variant: IconVariant) {
		const variantGlob = iconGlobs[variant];
		const globKey = Object.keys(variantGlob)[0];

		if (!globKey) {
			console.warn(`[Iconoir] No JSON found for variant: ${variant}`);
			svg = undefined;
			return;
		}

		if (!iconCache[variant]) {
			const mod = (await variantGlob[globKey]()) as { default: Record<string, string> };
			iconCache[variant] = new Map(Object.entries(mod.default));
		}

		svg = iconCache[variant]?.get(name);
	}
</script>

{#if svg}
	<IconoirBase
		{name}
		{altText}
		{size}
		{svg}
		style={interactive ? 'cursor: pointer' : undefined}
		{...$$restProps}
		on:click
		on:dblclick
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
	/>
{:else}
	<span title={`Iconoir not found: ${name}`} aria-hidden="true"></span>
{/if}
