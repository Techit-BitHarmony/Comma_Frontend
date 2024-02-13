<script lang="ts">

    import { onMount } from 'svelte';
    
    // 컴포넌트가 마운트된 후 실행되는 함수
    onMount(() => {
      const form = document.getElementById('articleForm');
    
      // 폼이 제출되었을 때
      form?.addEventListener('submit', async function(event) {
        event.preventDefault(); // 기본 제출 행동 방지
        const category = form.elements['category'].value;
        const title = form.elements['title'].value;
        const content = form.elements['content'].value;

        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
            
            if (!accessToken) {
              throw new Error('AccessToken이 없습니다.');
            }
    
        try {
          const response = await fetch('http://localhost:8090/community/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ category, title, content })
          });
    
          if (!response.ok) {
            throw new Error('네트워크 오류: ' + response.statusText);
          }
    
          const resp = await response.json();
    
          alert('글 작성 성공');
    
          window.location.href = '.';
    
    
        } catch (error) {
          console.error('글 작성 오류:', error);
          // 오류 메시지 표시 또는 사용자에게 다른 조치를 안내할 수 있습니다.
        }
      });
    });
    
    </script>
    
    <div class="container my-4 space-y-4">
        <form id=articleForm>
            <div>
                <label for="category">카테고리</label>
                <select name="category" id="category" required>
                    <option value="" disabled selected>카테고리를 선택하세요</option>
                    <option value="공지사항">공지사항</option>
                    <option value="홍보">홍보</option>
                    <option value="소통">소통</option>
                </select>
            </div>
            <div>
                <label for="title">제목</label>
                <input type="text" name="title" id="title" placeholder="제목을 입력하세요" required>
            </div>
            <div>
                <label for="content">내용</label>
                <input type="text" name="content" id="content" placeholder="내용을 입력하세요" required>
            </div>
            <button type="submit">작성완료</button>
        </form>
     
    </div>
    