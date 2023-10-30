<script lang="ts">
	import { ZoomOutIcon } from '$lib/icons/regular/zoom-out';
	// or...
	import { MinusCircleIcon } from '$lib/icons/solid/minus-circle';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<br />

<ZoomOutIcon on:click={() => alert('xs')} size="xs" />
<ZoomOutIcon on:click={() => alert('sm')} size="sm" />
<ZoomOutIcon on:click={() => alert('base')} />
<ZoomOutIcon on:click={() => alert('lg')} size="lg" />
<ZoomOutIcon on:click={() => alert('xl')} size="xl" />
<ZoomOutIcon on:click={() => alert('3rem')} size="3rem" />
<ZoomOutIcon on:click={() => alert('60')} size={60} />

<br />
<MinusCircleIcon name="minus-circle-solid" size="xs" />
<MinusCircleIcon name="minus-circle-solid" size="sm" />
<MinusCircleIcon name="minus-circle-solid" size="base" />
<MinusCircleIcon name="minus-circle-solid" size="lg" />
<MinusCircleIcon name="minus-circle-solid" size="xl" />
<MinusCircleIcon name="minus-circle-solid" size="3rem" />
<MinusCircleIcon name="minus-circle-solid" size="60" />
