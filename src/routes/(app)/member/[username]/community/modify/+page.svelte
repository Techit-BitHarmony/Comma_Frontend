<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loginUsername } from '$components/store.js';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';

	let articleId = $page.url.searchParams.get('articleId');
	let article = '';

	onMount(async () => {
		loadArticle();
	});

	async function loadArticle() {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch($baseUrl + `/community/articles/${articleId}`, {
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
				return; 
			}

			article = resp.data;
		} catch (error) {
			toastWarning('기존 글을 불러오는 데 실패하였습니다.');
		}
	}

	async function updateArticle(event) {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);
		const updateData = {
			category: formData.get('category'),
			title: formData.get('title'),
			content: formData.get('content')
		};

		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch($baseUrl + `/community/articles/${articleId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				},
				body: JSON.stringify(updateData)
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return; 
			}

			toastNotice('글 수정 성공');
			await goto('.');

		} catch (error) {
			console.error('글 수정 오류:', error);
		}
	}
</script>

<div>
	<div class="container bg-gray-light dark:bg-gray-dark my-4 w-full mt-20">
		<div class="m-5">
			<h1>
				글 수정하기
			</h1>
		</div>
		<div class="card card-body">
			<form on:submit={updateArticle}>
				<div class="mt-5">
					<label for="category">카테고리</label>
					<select class="select select-bordered w-full max-w-xs ms-2 text-gray-light" name="category" required>
						<option value="" disabled selected>카테고리를 선택하세요</option>
						<option value="공지사항">공지사항</option>
						<option value="홍보">홍보</option>
						<option value="소통">소통</option>
					</select>
				</div>
				<div class="mt-5">
					<label for="title">제목</label>
					<input
						type="text"
						name="title"
						id="title"
						class="input input-bordered w-10/12 max-w-xs ms-10 text-gray-light"
						placeholder="제목을 입력하세요"
						bind:value={article.title}
						required
					/>
				</div>
				<div class="flex items-center mt-5">
					<label for="content">내용</label>
					<textarea
						class="textarea textarea-bordered w-8/12 ms-11 text-gray-light"
						name="content"
						id="content"
						placeholder="내용을 입력하세요"
						bind:value={article.content}
						required
					/>
				</div>
				<div class="flex justify-center">
					<button class="btn btn-success mt-5" type="submit">작성완료</button>
				</div>
			</form>
		</div>
	</div>
</div>
