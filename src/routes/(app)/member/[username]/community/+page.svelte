<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store'; // Svelte store를 사용하여 페이지 번호를 관리합니다.

	let articles = writable([]); // 페이지네이션에 사용할 게시글 데이터를 저장하는 store
	let currentPage = writable(1); // 현재 페이지 번호를 저장하는 store
	let totalPages = writable(1); // 전체 페이지 수를 저장하는 store
	let itemsPerPage = 10; // 페이지당 항목 수
	let totalElements = '';

	onMount(async () => {
		// 페이지 로드 시 데이터를 불러옵니다.
		loadArticles();
	});

	// 페이지네이션을 위한 함수
	async function loadArticles() {
		try {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			// 현재 페이지와 페이지당 항목 수를 기반으로 데이터를 가져옵니다.
			const response = await fetch(
				`http://localhost:8090/community/articles?page=${$currentPage}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					}
				}
			);

			if (!response.ok) {
				throw new Error('네트워크 오류: ' + response.statusText);
			}

			const resp = await response.json();
			articles.set(resp.data.articleList.content);

			const totalArticles = resp.data.articleList.totalElements;
			totalElements = totalArticles;
			totalPages.set(Math.ceil(totalArticles / itemsPerPage));
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	}

	// 이전 페이지로 이동하는 함수
	function previousPage() {
		currentPage.update((n) => Math.max(n - 1, 1)); // 현재 페이지를 업데이트합니다.
		loadArticles(); // 새로운 페이지의 데이터를 불러옵니다.
	}

	// 다음 페이지로 이동하는 함수
	function nextPage() {
		currentPage.update((n) => n + 1); // 현재 페이지를 업데이트합니다.
		loadArticles(); // 새로운 페이지의 데이터를 불러옵니다.
	}

	function movePage(pageNumber: any) {
		currentPage.set(pageNumber); // 현재 페이지를 업데이트합니다.
		loadArticles(); // 새로운 페이지의 데이터를 불러옵니다.
	}
</script>

<div class="container my-4 space-y-4">
	<h1>커뮤니티</h1>

	{#each $articles as article, index}
		<div class="card w-auto bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex justify-between">
					<div class="flex justify-between items-center">
						<h2 class="card-title">{article.title}</h2>
						<span class="badge ml-2"
							>{new Date(article.createDate).toLocaleDateString('ko-KR', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
					<div class="dropdown">
						<div tabindex="0" role="button" class="btn btm-xs">. . .</div>
						<ul
							tabindex="0"
							class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li><a>수정하기</a></li>
							<li><a>삭제하기</a></li>
						</ul>
					</div>
				</div>
				<div class="border-b border-gray-300 pb-1 mb-4" />
				<p>{article.content}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary">댓글 작성하기</button>
				</div>
                <div class="border-b border-gray-300 pb-1 mt-4 mb-4" />
			</div>
		</div>
	{/each}

	<div class="join">
		<button class="join-item btn btn-square" on:click={previousPage}>이전</button>
		{#each Array.from({ length: $totalPages }, (_, index) => index + 1) as pageNumber}
			{#if pageNumber === $currentPage}
				<button class="join-item btn btn-square btn-active" on:click={() => movePage(pageNumber)}
					>{pageNumber}</button
				>
			{:else}
				<button class="join-item btn btn-square" on:click={() => movePage(pageNumber)}
					>{pageNumber}</button
				>
			{/if}
		{/each}
		<button class="join-item btn btn-square" on:click={nextPage}>다음</button>
	</div>
</div>
