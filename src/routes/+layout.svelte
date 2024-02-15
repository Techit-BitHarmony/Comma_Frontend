<script>
	import '../app.scss';
	import NativePlayer from '$components/player/NativePlayer.svelte';
	import Header from "$components/elements/Header.svelte";
	import Footer from "$components/elements/Footer.svelte";
	import {baseUrl, isLogin, loginUsername, loginMemberId} from "$components/store";
	import {getCookie} from "$components/token";
	import {onMount} from "svelte";

	let followData = {};

	async function getFollowList() {
		const response = await fetch($baseUrl + '/follow', {
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});
    const responseData = await response.json();

    followData = responseData.data;
	}

	async function moveToArtistProfile(followingUser) {
		window.location.href = `/member/${followingUser}`;
	}

	onMount(() => {
		loginUsername.set(localStorage.getItem('username'));
		loginMemberId.set(localStorage.getItem('memberId'));
	})

</script>

<div class="flex flex-col h-screen">
	<Header />
	<div class="flex-grow mt-20 bg-gray dark:bg-primary-dark">
		<slot />
	</div>
	<div class="fixed z-50 bottom-1 left-1">
		<label class="btn btn-ghost dark:text-primary" on:click={getFollowList} for="follow-drawer"><i class="fa-solid fa-bars fa-lg"></i></label>
	</div>
	<Footer />
</div>
<div class="fixed z-20 bottom-0 inset-x-0">
	<NativePlayer />
</div>

<div class="drawer drawer-start z-40">
	<input id="follow-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="follow-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-80 min-h-full bg-gray dark:bg-gray-dark text-base-content pt-24">
			<li class="text-primary-dark dark:text-primary text-xl font-bold pt-3">팔로우 목록</li>
			{#if $isLogin}
				{#each followData.followingList as followingUser}
					<li class="text-primary-dark dark:text-primary pt-3"><a on:click={() => moveToArtistProfile(followingUser)}>{followingUser}</a></li>
				{/each}
			{:else}
				<li class="text-primary-dark dark:text-primary pt-3">로그인 후 이용하실 수 있습니다.</li>
			{/if}
		</ul>
	</div>
</div>
