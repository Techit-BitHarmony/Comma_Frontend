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
            const response = await fetch(`http://localhost:8090/community/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('네트워크 오류: ' + response.statusText);
            }

			location.reload();
            
        } catch (error) {
            console.error('글 삭제 오류:', error);
        }
    }
</script>

<button on:click={deleteArticle}>삭제하기</button>