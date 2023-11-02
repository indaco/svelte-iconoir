<script lang="ts">
	import { ZoomOutIcon } from '$lib/icons/regular/zoom-out';
	import { MinusCircleIcon } from '$lib/icons/solid/minus-circle';
	import { SunLightIcon } from '$lib/icons/regular/sun-light';
</script>

<div class="header">
	<h1>@indaco/svelte-iconoir</h1>
	<a href="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml" target="_blank">
		<img
			src="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml/badge.svg"
			alt="CI"
		/>
	</a>
	&nbsp;
	<a href="https://github.com/indaco/svelte-iconoir/blob/main/LICENSE" target="_blank">
		<img
			src="https://img.shields.io/badge/license-mit-blue?style=flat-square&logo=none"
			alt="license"
		/>
	</a>
	&nbsp;
	<a href="https://www.npmjs.com/package/@indaco/svelte-iconoir" target="_blank"
		><img
			src="https://img.shields.io/npm/v/@indaco/svelte-iconoir.svg?style=flat"
			alt="NPM Package"
		/></a
	>

	<h2>
		The entire <a
			href="https://github.com/lucaburgio/iconoir"
			target="_blank"
			rel="noopener noreferrer">iconoir</a
		> set (1300+ SVG icons) as Svelte components.
	</h2>
</div>

<h2>Usage</h2>

<ZoomOutIcon />

<h2>Sizes</h2>

<MinusCircleIcon name="minus-circle-solid" size="xs" />
<MinusCircleIcon name="minus-circle-solid" size="sm" />
<MinusCircleIcon name="minus-circle-solid" size="base" />
<MinusCircleIcon name="minus-circle-solid" size="lg" />
<MinusCircleIcon name="minus-circle-solid" size="xl" />
<MinusCircleIcon name="minus-circle-solid" size="3em" />
<MinusCircleIcon name="minus-circle-solid" size="60" />

<h2>Events</h2>

<ZoomOutIcon on:click={() => alert('base')} />

<h2>Props</h2>

<ZoomOutIcon fill="red" stroke-width="3" />

<h2>Theming</h2>

<h3>Direct</h3>

<SunLightIcon class="roundedColor" />

<h3>Inline styles</h3>

<SunLightIcon
	style="background-color: green; padding: 4px; border-radius: 9999px;"
	color="#ffffff"
/>

<h3>With Tailwind CSS</h3>

<SunLightIcon class="p-1 rounded-full border-2 bg-green-400" />
