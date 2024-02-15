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
	let canLike = $state(true);

	let previousPage = base;

	afterNavigate(({from}) => {
		previousPage = from?.url.pathname || previousPage || '/';
	});

	async function getAlbumDetail() {

		const response = await fetch(`${$baseUrl}/album/detail/${albumId}`, {
			method: 'GET'
		});

		const responseData = await response.json();
		album = responseData.data;


		if (!response.ok) {
			toastWarning(responseData.message);
			await goto("/");
			return;
		}

		if(responseData.data.imgPath === null) {
			responseData.data.imgPath = "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg";
		}

		document.getElementById('albumCover').src = responseData.data.imgPath;

		if(getCookie('accessToken')) {
			const memberResponse = await fetch(`${$baseUrl}/member/mypage`, {
				method: 'GET',
				headers: {
					'Authorization': getCookie('accessToken'),
				},
			});

			const likeResponse = await fetch(`${$baseUrl}/album/${albumId}/like`, {
				method: 'GET',
				headers: {
					'Authorization': getCookie('accessToken'),
				},
			});

			if(memberResponse.ok) {
				const memberResponseData = await memberResponse.json();
				if (responseData.data.artistUsername === memberResponseData.data.username) {
					ismyAlbum = true;
				}
			}

			if(likeResponse.ok) {
				const likeResponseData = await likeResponse.json();
				if (likeResponseData.data === true) {
					canLike = true;
				}
				else {
					canLike = false;
				}
			}
		}

		toggleHeart();
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

	function toggleHeart() {
		var heartIcon = document.getElementById('heart-toggle').querySelector('svg');
		if (canLike === true) {
			heartIcon.classList.remove('text-red-500');
			heartIcon.classList.add('text-gray-500');
		} else {
			heartIcon.classList.remove('text-gray-500');
			heartIcon.classList.add('text-red-500');
		}
	}

	async function likeAlbum() {
		if (!getCookie('accessToken')) {
			await goto('/member/login');
			return;
		}

		if (canLike === true) {
			const response = await fetch(`${$baseUrl}/album/${albumId}/like`, {
				method: 'POST',
				headers: {
					'Authorization': getCookie('accessToken'),
				},
			});
			if (response.ok) {
				canLike = false;
				toastNotice("좋아요를 눌렀습니다.");
			}
		} else {
			const response = await fetch(`${$baseUrl}/album/${albumId}/cancelLike`, {
				method: 'POST',
				headers: {
					'Authorization': getCookie('accessToken'),
				},
			});
			if (response.ok) {
				canLike = true;
				toastNotice("좋아요를 취소했습니다.");
			}
		}

		toggleHeart();
	}
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
				  <span class="block w-300 h-300 relative">
					<img id="albumCover" class="w-full h-full object-cover mb-3"
						 src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"
						 alt="Album Cover"/>
				  </span>
					<button id="heart-toggle" on:click={likeAlbum}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
							<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
					</button>
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