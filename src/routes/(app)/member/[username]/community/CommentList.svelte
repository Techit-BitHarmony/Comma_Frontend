<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { loginUsername } from '$components/store.js';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';

	export let articleId = '';

	let comments: any[] = [];

	onMount(async () => {
		loadComments();
	});

	async function loadComments() {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch($baseUrl + `/community/comments/${articleId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
			}

			comments = resp.data.commentList;
		} catch (error) {
			toastWarning('댓글 불러오는 데 실패하였습니다.');
		}
	}

	async function deleteComment(commentId) {
		const accessToken = getCookie('accessToken');

		if (!accessToken) {
			toastWarning('로그인 해주세요.');
		}

		try {
			const response = await fetch($baseUrl + `/community/comments/${commentId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return;
			}

			toastNotice('댓글 삭제 성공');
			loadComments();
		} catch (error) {
			toastWarning('댓글 삭제하는 데 실패하였습니다.');
		}
	}
</script>

<div class="card-body">
	{#each comments as comment}
		<div class="flex justify-between items-center">
			<h5 class="card-title">{comment.username}</h5>
			<span class="badge ml-2"
				>{new Date(comment.createDate).toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit'
				})}</span
			>
		</div>
		<div class="flex justify-between">
			<p class="ms-5">{comment.content}</p>
			{#if $loginUsername === comment.username}
			<button class="btn btn-outline btn-xs" on:click={() => deleteComment(comment.commentId)}
				>삭제</button
			>
			<button class="btn btn-outline btn-xs">수정</button>
			{/if}
		</div>
		<div class="border" />
	{/each}
</div>
