<script lang="ts">
	import Back from '$components/elements/Back.svelte';
	import {baseUrl} from "$components/store";
	import {getCookie} from "$components/token";
	import {onMount} from "svelte";
	import {toastWarning} from "$components/toastr";

	$: ({ artistUsername } = $$restProps);
	let followData = {};
	$: followCheck = false;

	async function follow() {
		const response = await fetch($baseUrl + `/follow/${artistUsername}`, {
			method: 'POST',
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			toastWarning(errorData.message);
			return;
		}

		followCheck = true;
	}

	async function unfollow() {
		const response = await fetch($baseUrl + `/follow/${artistUsername}`, {
			method: 'DELETE',
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			toastWarning(errorData.message);
			return;
		}

		followCheck = false;
	}

	async function getFollowList() {
		const response = await fetch($baseUrl + '/follow', {
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});
		const responseData = await response.json();

		followData = responseData.data;
		if (followData.followingList.includes(artistUsername)) {
			followCheck = true;
		}
	}

	onMount(() => {
		getFollowList();
	})

</script>

<div class="relative overflow-hidden pt-8 z-10">
	<div class="container relative z-20">
		<Back />
	</div>
	<img
		alt="Artist"
		src="https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		width="100%"
		class="fixed inset-0 top-20 -z-10 h-80 w-full object-cover object-center"
	/>
	<div class="fixed top-20 h-80 bg-primary-dark/70 inset-0 z-0" />

	<div class="container relative z-20 pt-8 sm:pt-16 md:pt-24 pb-8">
		<div class="flex flex-row justify-between">
			<div>
				<h1 class="text-4xl text-gray-light dark:text-primary">
					{#if artistUsername}
						{artistUsername}
					{/if}
				</h1>
				{#if followCheck === true}
					<a class="btn btn-ghost text-gray-light" on:click={unfollow}><i class="fa-solid fa-user-minus fa-lg"></i></a>
				{:else}
					<a class="btn btn-ghost text-gray-light" on:click={follow}><i class="fa-solid fa-user-plus fa-lg"></i></a>
				{/if}
				<a class="btn btn-ghost text-gray-light" href="/member/{artistUsername}/donation">후원</a>
			</div>
			<div class="flex flex-col">
				<a class="btn btn-ghost text-gray-light" href="/album/release">앨범 등록</a>
				<a class="btn btn-ghost text-gray-light" href="/member/{artistUsername}/community">커뮤니티</a>
			</div>
		</div>

	</div>
</div>
