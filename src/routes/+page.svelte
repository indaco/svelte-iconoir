<script lang="ts">
	import { ZoomOutIcon } from '$lib/icons/zoom-out';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<br />

<ZoomOutIcon on:click={() => alert('sm')} size="sm" />
<ZoomOutIcon on:click={() => alert('xl')} size="xl" />
<ZoomOutIcon on:click={() => alert('2xl')} size="2xl" />
<ZoomOutIcon on:click={() => alert('2.5em')} size="2.5em" />
<ZoomOutIcon on:click={() => alert('50')} size={50} />
