<script lang="ts">
	import '../app.scss';
	import type { LayoutData } from './$types';
	import NativePlayer from '$components/player/NativePlayer.svelte';
	import Header from "$components/elements/Header.svelte";
	import Footer from "$components/elements/Footer.svelte";
	export let data: LayoutData;
</script>

<div class="flex flex-col h-screen">
	<Header />
	<div class="flex-grow mt-20 bg-gray dark:bg-primary-dark">
		<slot />
	</div>
	<Footer />
</div>
<div class="fixed z-20 bottom-0 inset-x-0">
	<NativePlayer />
</div>
