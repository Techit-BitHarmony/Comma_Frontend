<script>
	import {afterNavigate, goto} from '$app/navigation';
	import {base} from '$app/paths';
	import {audioTrack, baseUrl} from "$components/store.js";
	import { toastWarning, toastNotice } from "$components/toastr.js";
	import {onMount} from "svelte";
	import {page} from "$app/stores";
	import Back from "$components/elements/Back.svelte";
	import {getCookie} from "$components/token.js";

	let album = $state({});
	let albumId = $state({});
	let track = {};
	let ismyAlbum = $state(false);

	let previousPage = base;

	afterNavigate(({from}) => {
		previousPage = from?.url.pathname || previousPage || '/';
	});

	async function getAlbumDetail() {
		const response = await fetch(`${$baseUrl}/album/detail/${albumId}`, {
			method: 'GET'
		});

		const memberResponse = await fetch(`${$baseUrl}/member/mypage`, {
			method: 'GET',
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});

		const responseData = await response.json();
		const memberResponseData = await memberResponse.json();
		album = responseData.data;


		if (!response.ok) {
			toastWarning("앨범 정보를 불러오는데 실패했습니다.");
			await goto("/");
			return;
		}

		if(responseData.data.artistUsername === memberResponseData.data.username) {
			ismyAlbum = true;
		}

		document.getElementById('albumCover').src = responseData.data.imgPath;

		makeAudioTrack();
	}

	function makeCdnUrl(filePath) {
		let regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
		let match = filePath.match(regex)[0];
		return `https://bpykh1pc2283.edge.naverncp.com/hls/4wIoVJUORNKlK0DMCzj0-Q__/music/output/${match}_,64,128,kbps.m4a.smil/master.m3u8`;
	}

	function makeAudioTrack() {
		track = {
			cdnUrl: makeCdnUrl(album.filePath),
			imageUrl: null,
			artistUsername: album.artistUsername,
			artistNickname: album.artistNickname,
			name: album.albumname
		}
	}

	async function deleteAlbum() {
		const response = await fetch(`${$baseUrl}/album/${albumId}`, {
			method: 'DELETE',
			headers: {
				'Authorization': getCookie('accessToken'),
			},
		});

		if (response.ok) {
			const responseData = await response.json();
			toastNotice("앨범을 삭제했습니다.");
			await goto("/");
		} else {
			// Handle the case when the server responds with an error status
			console.error('Error deleting album:', response.status, response.statusText);
		}
	}

	let assignTrack = () => {
		audioTrack.set(track);
	};

	onMount(() => {
		albumId = $page.params['albumId'];
		getAlbumDetail();
	})

</script>

<div class="container my-4 space-y-4">
	<div class="pl-10 pr-10">
		<div class="flex flex-col">
			<div class="flex flex-row justify-between items-center mt-8">
				<div>
					<Back/>
				</div>
				<div class="text-center">
					<h1 class="text-3xl mb-3">{album.albumname}</h1>
					<a class="text-sm font-bold dark:text-primary-light hover:dark:text-primary"
					   href="/member/{album.artistUsername}">{album.artistNickname}</a>
				</div>
				<div class="flex flex-col">
					{#if ismyAlbum === true}
					<a class="btn btn-primary hover:btn-ghost dark:text-gray-dark mb-3" href="/album/modify/{albumId}">수정</a>
					<a class="btn btn-error hover:btn-ghost dark:text-gray-dark" on:click={deleteAlbum}>삭제</a>
					{/if}
				</div>
			</div>
			<div class="divider"></div>
			<div class="flex flex-row justify-center items-center">
				<div class="flex flex-col m-5 w-1/2 relative">
          <span class="block w-64 h-64 relative">
            <img id="albumCover" class="w-full h-full object-cover"
				 src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"
				 alt="Album Cover"/>
          </span>
				</div>
				<div class="flex flex-col m-5 w-1/2">
					<p>곡 장르</p>
					<div class="badge badge-primary badge-outline m-3">{album.genre}</div>
					<p>CCL</p>
					{#if album.license === true}
						<div class="badge badge-primary badge-outline m-3">허용</div>
						<p>라이센스 설명</p>
						<div class="text-sm m-3">{album.licenseDescription}</div>
					{:else}
						<div class="badge badge-primary badge-outline m-3">비허용</div>
					{/if}
					<p>가격</p>
					{#if album.permit === false}
						<div class="badge badge-primary badge-outline m-3">무료</div>
					{:else}
						<div class="badge badge-primary badge-outline m-3">유료</div>
					{/if}
				</div>
			</div>
			<div class="flex flex-col m-5">
				<a class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3 w-full"
				   on:click={assignTrack}>음악 재생</a>
			</div>
		</div>
	</div>
</div>