<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { baseUrl } from '$components/store';
	import { getCookie } from '$components/token.js';

	// 컴포넌트가 마운트된 후 실행되는 함수
	onMount(() => {
		const form = document.getElementById('articleForm');

		// 폼이 제출되었을 때
		form?.addEventListener('submit', async function (event) {
			event.preventDefault(); // 기본 제출 행동 방지
			const category = form.elements['category'].value;
			const title = form.elements['title'].value;
			const content = form.elements['content'].value;
			const artistUsername = form.elements['artistUsername'].value;

			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}
			try {
				const response = await fetch($baseUrl + '/community/articles', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ category, title, content, artistUsername })
				});

				const resp = await response.json();

				if (!response.ok) {
					toastWarning(resp.message);
					return;
				}

				toastNotice('글 작성 성공');

				await goto('.');
			} catch (error) {
				console.error('글 작성 오류:', error);
			}
		});
	});
</script>

<div class="container bg-gray-light dark:bg-gray-800 my-4 w-full mt-20">
	<div class="card card-body">
		<h1>글 작성하기</h1>
		<form id="articleForm">
			<div class="mt-5">
				<label class="text-primary-dark dark:text-primary" for="category"
					><i class="fa-solid fa-list me-3" />카테고리</label
				>
				<select
					class="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-2"
					name="category"
					required
				>
					<option value="" disabled selected>카테고리를 선택하세요</option>
					<option value="공지사항">공지사항</option>
					<option value="홍보">홍보</option>
					<option value="소통">소통</option>
				</select>
			</div>
			<div class="mt-5">
				<label class="text-primary-dark dark:text-primary" for="title"
					><i class="fa-solid fa-heading me-3" />제목</label
				>
				<input
					type="text"
					name="title"
					id="title"
					class="input input-bordered w-10/12 max-w-xs text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-10"
					placeholder="제목을 입력하세요"
					required
				/>
			</div>
			<div class="flex items-center mt-5">
				<label class="text-primary-dark dark:text-primary" for="content"
					><i class="fa-solid fa-message me-3" />내용</label
				>
				<textarea
					class="textarea textarea-bordered w-8/12 text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-11"
					name="content"
					id="content"
					placeholder="내용을 입력하세요"
					required
				/>
				<input
					type="hidden"
					name="artistUsername"
					id="artistUsername"
					value={$page.params.username}
				/>
			</div>
			<div class="flex justify-center">
				<button
					class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-5"
					type="submit">작성완료</button
				>
			</div>
		</form>
	</div>
</div>
