<script lang="ts">

    import { onMount } from 'svelte';
    
    // 컴포넌트가 마운트된 후 실행되는 함수
    onMount(() => {
      const form = document.getElementById('withdrawForm');
    
      // 폼이 제출되었을 때
      form?.addEventListener('submit', async function(event) {
        event.preventDefault(); // 기본 제출 행동 방지
        const bankName = form.elements['bankName'].value;
        const bankAccountNo = form.elements['bankAccountNo'].value;
        const withdrawAmount = form.elements['withdrawAmount'].value;

        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
            
            if (!accessToken) {
              throw new Error('AccessToken이 없습니다.');
            }
    
        try {
          const response = await fetch('http://localhost:8090/credit/withdraws', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ bankName, bankAccountNo, withdrawAmount })
          });
    
          if (!response.ok) {
            throw new Error('네트워크 오류: ' + response.statusText);
          }
    
          const resp = await response.json();
    
          alert('출금 신청 성공');
    
          window.location.href = '/credit';
    
    
        } catch (error) {
          console.error('충전 오류:', error);
          // 오류 메시지 표시 또는 사용자에게 다른 조치를 안내할 수 있습니다.
        }
      });
    });
    
    </script>
    
    <div class="container my-4 space-y-4">
        <form id=withdrawForm>
            <div>
                <label for="bankName">은행명:</label>
                <input type="text" name="bankName" id="bankName" placeholder="은행명을 입력하세요" required>
            </div>
            <div>
                <label for="bankAccountNo">계좌번호:</label>
                <input type="text" name="bankAccountNo" id="bankAccountNo" placeholder="계좌번호를 입력하세요('-' 없이)" required>
            </div>
            <div>
                <label for="withdrawAmount">출금신청액:</label>
                <input type="text" name="withdrawAmount" id="withdrawAmount" placeholder="금액을 입력하세요" required>
            </div>
            <button type="submit">출금 신청하기</button>
        </form>
     
    </div>
    