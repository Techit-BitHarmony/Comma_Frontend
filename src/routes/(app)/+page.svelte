<script>
	import Cover from '$components/elements/Cover.svelte';
	import Coverage from '$components/elements/Coverage.svelte';
  import { baseUrl } from "$components/store.js";
	import {onMount} from "svelte";

	let newAlbums = $state({});

	async function getAlbums() {
		const response = await fetch($baseUrl + "/album/list", {
			method: 'GET',
		});

		const responseData = await response.json();
		newAlbums = responseData;
	}

	onMount(() => {
		getAlbums();
	})

</script>

<div class="container my-4 space-y-4">
	{#if newAlbums.content}
		<Coverage album={newAlbums.content[0]} />
	{/if}
	<h1>New album releases</h1>
	<div class="wrapper-cover">
		{#each newAlbums.content as item}
			<Cover {...item} />
		{/each}
	</div>
</div>
