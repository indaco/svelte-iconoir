<script lang="ts">
	import Iconoir from '$lib/Iconoir.svelte';
</script>

<div class="header">
	<h1>@indaco/svelte-iconoir</h1>
	<a href="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml" target="_blank">
		<img
			src="https://github.com/indaco/svelte-iconoir/actions/workflows/release.yml/badge.svg"
			alt="CI"
		/>
	</a>
	<a href="https://github.com/indaco/svelte-iconoir/blob/main/LICENSE" target="_blank">
		<img
			src="https://img.shields.io/badge/license-mit-blue?style=flat-square&logo=none"
			alt="license"
		/>
	</a>
	<a href="https://www.npmjs.com/package/@indaco/svelte-iconoir" target="_blank">
		<img
			src="https://img.shields.io/npm/v/@indaco/svelte-iconoir.svg?style=flat"
			alt="NPM Package"
		/>
	</a>
	<h2>
		The entire <a
			href="https://github.com/lucaburgio/iconoir"
			target="_blank"
			rel="noopener noreferrer">iconoir</a
		>
		set (1600+ SVG icons) as Svelte components.
	</h2>
</div>

<h2>Usage</h2>
<Iconoir name="zoom-out" />

<h2>Variants</h2>
<div class="icon-row">
	<div class="icon-stack">
		<span>regular</span>
		<Iconoir name="minus-circle" />
	</div>
	<div class="icon-stack">
		<span>solid</span>
		<Iconoir name="minus-circle" variant="solid" />
	</div>
</div>

<h2>Sizes</h2>
<div class="icon-row">
	<Iconoir name="minus-circle" size="xs" />
	<Iconoir name="minus-circle" size="sm" />
	<Iconoir name="minus-circle" size="base" />
	<Iconoir name="minus-circle" size="lg" />
	<Iconoir name="minus-circle" size="xl" />
	<Iconoir name="minus-circle" size="3em" />
	<Iconoir name="minus-circle" size="60" />
</div>

<h2>Events</h2>
<Iconoir name="zoom-out" on:click={() => alert('Icon clicked')} interactive />

<h2>Props</h2>
<Iconoir name="zoom-out" fill="red" stroke-width="3" />

<h2>Theming</h2>

<h3>Direct (CSS Class)</h3>
<Iconoir name="sun-light" class="roundedColor" />

<h3>Inline styles</h3>
<Iconoir
	name="sun-light"
	style="background-color: green; padding: 4px; border-radius: 9999px;"
	color="#ffffff"
/>

<h3>With Tailwind CSS</h3>
<!-- If Tailwind is enabled -->
<Iconoir name="sun-light" class="p-1 rounded-full border-2 bg-green-400 text-white" />

<style>
	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.header a {
		display: inline-block;
		margin: 0 0.25rem;
	}

	h2 {
		margin-top: 2rem;
		font-size: 1.25rem;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 0.25rem;
	}

	.icon-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin: 1rem 0;
	}

	.icon-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
</style>
