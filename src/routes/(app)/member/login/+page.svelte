<script lang="ts">

  import { onMount } from 'svelte';
  
  // 컴포넌트가 마운트된 후 실행되는 함수
  onMount(() => {
    const form = document.getElementById('loginForm');
  
    // 폼이 제출되었을 때
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // 기본 제출 행동 방지
      const username = form.elements['username'].value;
      const password = form.elements['password'].value;
  
      try {
        const response = await fetch('http://localhost:8090/member/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (!response.ok) {
          throw new Error('네트워크 오류: ' + response.statusText);
        }
  
        const data = await response.json();
        const accessToken = data.data.accessToken;
        const refreshToken = data.data.refreshToken;
  
        // accessToken과 refreshToken을 로컬 저장소에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
  
        // 로그인 성공 메시지 표시
        alert('로그인 성공');
  
        // 이후 작업: 로그인 성공 후 리다이렉트 또는 추가 작업 수행 가능
  
      } catch (error) {
        console.error('로그인 오류:', error);
        // 오류 메시지 표시 또는 사용자에게 다른 조치를 안내할 수 있습니다.
      }
    });
  });
  
  </script>
  
  <div class="container my-4 space-y-4">
  
  <form id=loginForm>
      <label for="username">아이디:</label>
      <input type="text" name="username" id="username" placeholder="아이디" required>
      <label for="password">비밀번호:</label>
      <input type="text" name="password" id="password" placeholder="비밀번호" required>
      <button type="submit">로그인</button>
  </form>
  
  </div>