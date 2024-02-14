<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation'
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';


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

			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
				return; 
			}

			try {
				const response = await fetch('http://localhost:8090/community/articles', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ category, title, content, artistUsername })
				});

				if (!response.ok) {
					toastWarning('네트워크 오류: ' + response.statusText);
					return; 
				}

				const resp = await response.json();

				toastNotice('글 작성 성공');

				await goto('.'); 
			} catch (error) {
				console.error('글 작성 오류:', error);
			}
		});
	});
</script>

<div class="container bg-base-100 dark:bg-gray-800 my-4 w-full">
	<div class="card card-body">
		<form id="articleForm">
			<div class="mt-5">
				<label class="text-primary-dark dark:text-primary" for="category">카테고리</label>
				<select class="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-2" name="category" required>
					<option value="" disabled selected>카테고리를 선택하세요</option>
					<option value="공지사항">공지사항</option>
					<option value="홍보">홍보</option>
					<option value="소통">소통</option>
				</select>
			</div>
			<div class="mt-5">
				<label class="text-primary-dark dark:text-primary" for="title">제목</label>
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
				<label class="text-primary-dark dark:text-primary" for="content">내용</label>
				<textarea
					class="textarea textarea-bordered w-8/12 text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-11"
					name="content"
					id="content"
					placeholder="내용을 입력하세요"
					required
				/>
        <input type="hidden" name="artistUsername" id="artistUsername" value={$page.params.username}>
			</div>
			<div class="flex justify-center">
				<button class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-5" type="submit">작성완료</button>
			</div>
		</form>
	</div>
</div>
