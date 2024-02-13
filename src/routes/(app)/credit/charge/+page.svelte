<script lang="ts">

import { onMount } from 'svelte';

// 컴포넌트가 마운트된 후 실행되는 함수
onMount(() => {
  const form = document.getElementById('chargeForm');

  // 폼이 제출되었을 때
  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // 기본 제출 행동 방지
    const chargeAmount = form.elements['chargeAmount'].value;
    const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
        
        if (!accessToken) {
          throw new Error('AccessToken이 없습니다.');
        }

    try {
      const response = await fetch('http://localhost:8090/credit/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`
        },
        body: JSON.stringify({ chargeAmount })
      });

      if (!response.ok) {
        throw new Error('네트워크 오류: ' + response.statusText);
      }

      const resp = await response.json();
      const chargeId = resp.chargeId;

      alert('주문서 생성 성공');

      window.location.href = `/credit/charge/payment?chargeId=${chargeId}`;


    } catch (error) {
      console.error('충전 오류:', error);
      // 오류 메시지 표시 또는 사용자에게 다른 조치를 안내할 수 있습니다.
    }
  });
});

</script>

<div class="container my-4 space-y-4">
    <form id=chargeForm>
        <label for="chargeAmount">충전 크레딧:</label>
        <input type="text" name="chargeAmount" id="chargeAmount" placeholder="금액을 입력하세요" required>
        <button type="submit">충전하기</button>
    </form>
 
</div>
