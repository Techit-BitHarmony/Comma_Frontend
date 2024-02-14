<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { loginUsername } from '$components/store.js';
	import { isLogin } from '$components/store.js';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';
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
			const response = await fetch(
				$baseUrl + `/community/articles/user/${$page.params.username}?page=${$currentPage}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return;
			}

			articles.set(resp.data.articleList.content);

			const totalArticles = resp.data.articleList.totalElements;
			totalElements = totalArticles;
			totalPages.set(Math.ceil(totalArticles / itemsPerPage));
		} catch (error) {
			toastWarning('글 목록을 불러오는 데 실패하였습니다.');
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
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
				return;
			}

			const response = await fetch($baseUrl + '/community/comments', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				},
				body: JSON.stringify({ articleId, content })
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
			}

			location.reload();
			scrollToArticle(articleId);
			form.reset();
		} catch (error) {
			toastWarning('댓글 작성에 실패하였습니다.');
		}
	}
</script>

<div class="container my-4 space-y-4">
	<div class="flex justify-between items-center my-6 mb-4">
		<h1>{$page.params.username}님의 게시판</h1>
		{#if $isLogin === true}
			<a class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost" href="./community/write">글쓰기</a>
		{/if}
	</div>

	{#if $articles.length === 0}
		<div class="flex justify-center">
			<h2 class="text-primary-dark dark:text-primary">등록된 게시글이 없습니다.</h2>
		</div>
	{/if}
	{#each $articles as article, index}
		<div class="card w-auto bg-base-100 dark:bg-gray-800 shadow-xl">
			<div class="card-body">
				<div class="flex justify-between">
					<div class="flex-col items-center">
						<h2 class="card-title mb-2">{article.title}</h2>
						<div>
							<span class="text-primary-dark dark:text-primary">작성자 : {article.username}</span>
							<span class="badge dark:badge-primary ml-2"
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
					{#if $loginUsername === article.username}
						<div class="dropdown">
							<div tabindex="0" role="button" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btm-xs">. . .</div>
							<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 dark:bg-gray-600 rounded-box w-52">
								<li><a class="text-primary-dark dark:text-primary font-extrabold" href="./community/modify?articleId={article.id}">수정하기</a></li>
								<li><DeleteButton articleId={article.id} /></li>
							</ul>
						</div>
					{/if}
				</div>
				<div class="divider divider-neutral dark:divider-accent" />
				<p class="text-primary-dark dark:text-primary">{article.content}</p>
				<div class="divider dark:divider-accent mt-20">댓글</div>

				<details class="collapse bg-base-200">
					<summary class="collapse-title bg-base-200 dark:bg-gray-600 text-sm font-medium">댓글 작성하기</summary>
					<div class="collapse-content bg-base-200 dark:bg-gray-600">
						<form id="commentForm" on:submit={submitComment}>
							<div>
								<input
									class="input input-bordered input-md bg-base-100 dark:bg-gray-800 w-full max-w-xs"
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
