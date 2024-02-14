<script>
	import ArtistHeader from '$components/elements/ArtistHeader.svelte';
	import {baseUrl} from "$components/store";
	import {getCookie} from "$components/token";
	import {onMount} from "svelte";
	import {page} from "$app/stores";
  import Cover from "$components/elements/Cover.svelte";

	let username = '';
	let memberData = {};
  let artistAlbums = {};

	async function getMemberProfile() {
		const memberResponse = await fetch(`${$baseUrl}/member/${username}`, {
			method: 'GET',
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});

		memberData = memberResponse.json();
	}

  async function getAlbums() {
    const response = await fetch($baseUrl + `/album/${username}`, {
      method: 'GET',
    });

    const responseData = await response.json();
    artistAlbums = responseData.data;
  }

	onMount(() => {
		username = $page.params['username'];
		getMemberProfile();
    getAlbums();
	});
</script>


<div class="container my-4 space-y-4">
  <div>

  </div>
  <ArtistHeader artistUsername={username} />

  <div class="container">
    <h1 class="title my-4">Albums</h1>
    <div class="wrapper-cover">
      {#each artistAlbums.content as item}
        <Cover {...item} />
      {/each}
    </div>
  </div>

</div>


