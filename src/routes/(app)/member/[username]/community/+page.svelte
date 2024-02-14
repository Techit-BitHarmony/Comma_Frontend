<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import CommentList from './CommentList.svelte';
	import DeleteButton from './DeleteButton.svelte';

	let articles = writable([]);
	let currentPage = writable(1);
	let totalPages = writable(1);
	let itemsPerPage = 10;
	let totalElements = '';

	onMount(async () => {
		loadArticles();
	});

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
				`http://localhost:8090/community/articles/user/${$page.params.username}?page=${$currentPage}`,
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

	function previousPage() {
		currentPage.update((n) => Math.max(n - 1, 1));
		loadArticles();
	}

	function nextPage() {
		currentPage.update((n) => n + 1);
		loadArticles();
	}

	function movePage(pageNumber) {
		currentPage.set(pageNumber);
		loadArticles();
	}

	function scrollToArticle(articleId) {
		console.log('Scrolling to article:', articleId);
		window.location.hash = `#article-${articleId}`;
	}

	async function submitComment(event) {
		event.preventDefault(); // 폼의 기본 동작인 페이지 새로고침을 막습니다.

		const form = event.target;
		const articleId = form.elements['articleId'].value;
		const content = form.elements['content'].value;

		try {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			const response = await fetch('http://localhost:8090/community/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				},
				body: JSON.stringify({ articleId, content })
			});

			if (!response.ok) {
				throw new Error('네트워크 오류: ' + response.statusText);
			}

			scrollToArticle(articleId);
			form.reset();
			location.reload();
		} catch (error) {
			console.error('댓글을 작성하는 중 오류 발생:', error);
		}
	}
</script>

<div class="container my-4 space-y-4">
	<div class="flex justify-between items-center my-6 mb-4">
		<h1>커뮤니티</h1>
		<a class="btn btn-primary" href="./community/write">글쓰기</a>
	</div>

	{#if $articles.length === 0}
	<div class="flex justify-center">
		<h2>등록된 게시글이 없습니다.</h2>
	</div>
	{/if}
	{#each $articles as article, index}
		<div class="card w-auto bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex justify-between">
					<div class="flex-col items-center">
						<h2 class="card-title mb-2">{article.title}</h2>
						<div>
							<span>작성자 {article.username}</span>
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
					</div>
					<div class="dropdown">
						<div tabindex="0" role="button" class="btn btm-xs">. . .</div>
						<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							<li><a href='./community/modify?articleId={article.id}'>수정하기</a></li>
							<li><DeleteButton articleId={article.id} /></li>
						</ul>
					</div>
				</div>
				<div class="divider divider-neutral"></div>
				<p>{article.content}</p>
				<div class="divider mt-20">댓글</div>

				<details class="collapse bg-base-200">
					<summary class="collapse-title text-sm font-medium">댓글 작성하기</summary>
					<div class="collapse-content">
						<form id="commentForm" on:submit={submitComment}>
							<div>
								<input
									class="input input-bordered input-md w-full max-w-xs"
									type="text"
									name="content"
									placeholder="댓글을 작성하세요."
								/>
								<input type="hidden" name="articleId" value={article.id} />
								<button type="submit" class="btn btn-primary">작성</button>
							</div>
						</form>
					</div>
				</details>
			</div>
			<div>
				<CommentList articleId={article.id} />
			</div>
		</div>
	{/each}

	<div class="join flex justify-center">
		
		{#if $totalPages > 0}
		<button class="join-item btn btn-square" on:click={previousPage}>이전</button>
		{/if}
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
		{#if $totalPages > 0}
		<button class="join-item btn btn-square" on:click={nextPage}>다음</button>
		{/if}
	</div>
</div>
