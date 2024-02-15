<script lang="ts">
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

	let articles = writable<any[]>([]);
	let currentPage = writable(1);
	let totalPages = writable(1);
	let itemsPerPage = 10;
	let totalElements = '';

	let selectedButton = '';
	let currentCategory = '';

	function selectButton(category: any) {
		selectedButton = category; 
		currentCategory = category; 
		loadArticles(category);
	}

	onMount(async () => {
		loadArticles('');
	});

	async function loadArticles(category: any) {
		try {
			const response = await fetch(
				$baseUrl +
					`/community/articles/user/${$page.params.username}?page=${$currentPage}&category=${category}`,
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
		loadArticles(currentCategory);
		
	}

	function nextPage() {
		currentPage.update((n) => n + 1);
		loadArticles(currentCategory);
	}

	function movePage(pageNumber: any) {
		currentPage.set(pageNumber);
		loadArticles(currentCategory);
	}

	function scrollToArticle(articleId: any) {
		window.location.hash = `#article-${articleId}`;
	}

	async function submitComment(event: any) {
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
		<h1>{$page.params.username}님의 게시판<i class="fa-solid fa-compact-disc ms-3"></i></h1>
		{#if $isLogin === true}
			<a
				class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost"
				href="./community/write"><i class="fa-solid fa-pen-to-square"></i>글쓰기</a
			>
		{/if}
	</div>
	<div class="flex">
		<button
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			''
				? 'btn-disabled'
				: ''}"
			on:click={() => selectButton('')}><i class="fa-solid fa-align-justify"></i>전체</button
		>
		<div class="divider divider-horizontal" />
		<button
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'공지사항'
				? 'btn-disabled'
				: ''}"
			on:click={() => selectButton('공지사항')}><i class="fa-solid fa-bullhorn"></i>공지사항</button
		>
		<div class="divider divider-horizontal" />
		<button
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'홍보'
				? 'btn-disabled'
				: ''}"
			on:click={() => selectButton('홍보')}><i class="fa-solid fa-music"></i>홍보</button
		>
		<div class="divider divider-horizontal" />
		<button
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'소통'
				? 'btn-disabled'
				: ''}"
			on:click={() => selectButton('소통')}><i class="fa-solid fa-comments"></i>소통</button
		>
	</div>

	{#if $articles.length === 0}
		<div class="flex justify-center">
			<h2 class="text-primary-dark dark:text-primary">등록된 게시글이 없습니다.</h2>
		</div>
	{/if}
	{#each $articles as article, index}
		<div class="card w-auto bg-gray-light dark:bg-gray-800 shadow-xl">
			<div class="card-body">
				<div class="flex justify-between">
					<div class="flex-col items-center">
						<h2 class="card-title mb-2">{article.title}</h2>
						<div>
							<span class="text-primary-dark dark:text-primary">작성자 : {article.username}</span>
							<span class="badge dark:badge-primary badge-outline dark:badge-outline ml-2"
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
							<div
								tabindex="0"
								role="button"
								class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btm-xs"
							>
								. . .
							</div>
							<ul
								class="dropdown-content z-[1] menu p-2 shadow bg-gray-light dark:bg-gray-600 rounded-box w-52"
							>
								<li>
									<a
										class="text-primary-dark dark:text-primary font-extrabold"
										href="./community/modify?articleId={article.id}"><i class="fa-solid fa-hammer"></i>수정하기</a
									>
								</li>
								<li><DeleteButton articleId={article.id} /></li>
							</ul>
						</div>
					{/if}
				</div>
				<div class="divider divider-neutral dark:divider-accent" />
				<p class="text-primary-dark dark:text-primary">{article.content}</p>
				<div class="divider dark:divider-accent mt-20">댓글</div>

				<details class="collapse bg-gray">
					<summary class="collapse-title bg-gray dark:bg-gray-600 text-sm font-medium"
						><i class="fa-regular fa-note-sticky me-3"></i>댓글 작성하기</summary
					>
					<div class="collapse-content bg-gray dark:bg-gray-600">
						<form id="commentForm" on:submit={submitComment}>
							<div>
								<input
									class="input input-bordered input-md bg-gray-light dark:bg-gray-800 w-full max-w-xs"
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
			<button class="join-item btn btn-square" on:click={previousPage}><i class="fa-solid fa-caret-left"></i></button>
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
		{#if $totalPages > $currentPage}
			<button class="join-item btn btn-square" on:click={nextPage}><i class="fa-solid fa-caret-right"></i></button>
		{/if}
	</div>
</div>
