<script lang="ts">
	import { onMount } from 'svelte';

	export let articleId = '';
	let comments: any[] = [];

	onMount(async () => {
		loadComments();
	});

	async function loadComments() {
		try {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			const response = await fetch(`http://localhost:8090/community/comments/${articleId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			if (!response.ok) {
				throw new Error('네트워크 오류: ' + response.statusText);
			}

			const resp = await response.json();

			comments = resp.data.commentList;
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	}

	async function deleteComment(commentId) {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			try {
				const response = await fetch(`http://localhost:8090/community/comments/${commentId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					}
				});

				if (!response.ok) {
					throw new Error('네트워크 오류: ' + response.statusText);
				}

				alert('댓글 삭제 성공');
				location.reload();
			} catch (error) {
				console.error('댓글 삭제 오류:', error);
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
			<button class="btn btn-outline btn-xs" on:click={() => deleteComment(comment.commentId)}>삭제</button>
		</div>
		<div class="border" />
	{/each}
</div>
