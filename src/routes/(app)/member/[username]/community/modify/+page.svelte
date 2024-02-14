<script lang="ts">
    	import { page } from '$app/stores';
        import { onMount } from 'svelte';

        let articleId = $page.url.searchParams.get('articleId'); 
        let article = '';

        onMount(async () => {
		loadArticle();
	});

    async function loadArticle() {
		try {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			const response = await fetch(
				`http://localhost:8090/community/articles/${articleId}`,
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
            article = resp.data; 

		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
    }

    async function updateArticle(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const updateData = {
            category: formData.get('category'),
            title: formData.get('title'),
            content: formData.get('content'),
        };

        try {
            const accessToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('accessToken='))
                ?.split('=')[1];

            if (!accessToken) {
                throw new Error('AccessToken이 없습니다.');
            }

            const response = await fetch(`http://localhost:8090/community/articles/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${accessToken}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('네트워크 오류: ' + response.statusText);
            }

            alert('글 수정 성공');
            window.location.href = '.';

        } catch (error) {
            console.error('글 수정 오류:', error);
        }
    }

</script>

<div>
	<div class="container bg-base-100 my-4 w-full">
		<div class="card card-body">
			<form on:submit={updateArticle}>
				<div class="mt-5">
					<label for="category">카테고리</label>
					<select class="select select-bordered w-full max-w-xs ms-2" name="category" required>
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
						class="input input-bordered w-10/12 max-w-xs ms-10"
						placeholder="제목을 입력하세요"
                        bind:value={article.title}
						required
					/>
				</div>
				<div class="flex items-center mt-5">
					<label for="content">내용</label>
					<textarea
						class="textarea textarea-bordered w-8/12 ms-11"
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
