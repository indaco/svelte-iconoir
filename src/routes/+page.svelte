<script lang="ts">
	import { ZoomOutIcon } from '$lib/icons/zoom-out';
	import { AppleShortcutsIcon } from '$lib/icons/apple-shortcuts';
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
<AppleShortcutsIcon name="apple-shortcuts" size="xs" />
<AppleShortcutsIcon name="apple-shortcuts" size="sm" />
<AppleShortcutsIcon name="apple-shortcuts" size="base" />
<AppleShortcutsIcon name="apple-shortcuts" size="lg" />
<AppleShortcutsIcon name="apple-shortcuts" size="xl" />
<AppleShortcutsIcon name="apple-shortcuts" size="3rem" />
<AppleShortcutsIcon name="apple-shortcuts" size="60" />
