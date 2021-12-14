<script>
	export let icon = {};
	export let alt = '';
	export let size = '1.5em';
	export let color = 'currentColor';

	$: altText = alt != '' ? alt : icon.name;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	stroke-width={1.5}
	viewBox="0 0 24 24"
	fill="none"
	{color}
	aria-labelledby={altText}
	class={$$props.class}
	aria-hidden="true"
>
	{#each icon.data ?? [] as attr}
		<!-- @ts-ignore -->
		<path {...attr} />
	{/each}
</svg>
