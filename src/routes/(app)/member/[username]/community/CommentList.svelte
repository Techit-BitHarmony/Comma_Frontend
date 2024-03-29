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
	let editingCommentId = null; // 수정 중인 댓글의 ID를 저장할 변수


	onMount(async () => {
		loadComments();
	});

	async function loadComments() {
		try {
			const response = await fetch($baseUrl + `/community/comments/${articleId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
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
			return; 
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

	async function startEdit(commentId) {
		editingCommentId = commentId;
	}

	async function saveEdit(commentId, newContent) {

		const accessToken = getCookie('accessToken');

		if (!accessToken) {
			toastWarning('로그인 해주세요.');
		}

		try {
			const response = await fetch($baseUrl + `/community/comments/${commentId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				},
				body: JSON.stringify({ content: newContent })
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return;
			}

			toastNotice('댓글 수정 성공');
			loadComments();
		} catch (error) {
			toastWarning('댓글 수정하는 데 실패하였습니다.');
		} finally {
			editingCommentId = null; // 수정 완료 후 수정 상태 해제
		}
	}
</script>

<div class="card-body">
	{#each comments as comment}
		<div class="flex justify-between items-center">
			<h5 class="card-title text-primary-dark dark:text-primary"><i class="fa-solid fa-user"></i>{comment.username}</h5>
			<span class="badge dark:badge-primary badge-outline dark:badge-outline ml-2"
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
			{#if editingCommentId === comment.commentId}
				<textarea class="textarea textarea-bordered textarea-sm w-full text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 max-w-xs" bind:value={comment.content}></textarea>
				<button class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btn-xs" on:click={() => saveEdit(comment.commentId, comment.content)}
					>저장</button
				>
			{:else}
				<p class="text-primary-dark dark:text-primary ms-5">{comment.content}</p>
				{#if $loginUsername === comment.username}
					<button class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btn-xs" on:click={() => startEdit(comment.commentId)}
						><i class="fa-solid fa-hammer"></i>수정</button
					>
					<button class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btn-xs" on:click={() => deleteComment(comment.commentId)}
						><i class="fa-solid fa-trash"></i>삭제</button
					>
				{/if}
			{/if}
		</div>
		<div class="border dark:border-accent" />
	{/each}
</div>
