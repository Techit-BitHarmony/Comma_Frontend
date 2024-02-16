<script>
    export let articleId;

    async function deleteArticle() {
        const accessToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            ?.split('=')[1];

        if (!accessToken) {
            throw new Error('AccessToken이 없습니다.');
        }

        try {
            const response = await fetch(`${$baseUrl}/community/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('네트워크 오류: ' + response.statusText);
            }

            alert('글 삭제 성공')
			      location.reload();
            
        } catch (error) {
            console.error('글 삭제 오류:', error);
        }
    }
</script>

<button class="text-primary-dark dark:text-primary font-extrabold" on:click={deleteArticle}><i class="fa-solid fa-trash"></i>삭제하기</button>