<script lang="ts">
    import { onMount } from 'svelte';
  
    let restCredit = '';
    let creditLogs: any[] = [];
  
    // 페이지 로드 시 서버에서 데이터를 가져옴
    onMount(async () => {
      try {
        const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
        
        if (!accessToken) {
          throw new Error('AccessToken이 없습니다.');
        }
  
        const response = await fetch('http://localhost:8090/credit/creditlogs/mine', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accessToken}`
          }
        });
  
        if (!response.ok) {
          throw new Error('네트워크 오류: ' + response.statusText);
        }
  
        const resp = await response.json();
        restCredit = resp.restCredit;
        creditLogs = resp.creditLogDtos;
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    });
  </script>
  
  <div class="container my-4 space-y-4">
    <h1>잔여 크레딧: {restCredit}</h1>
    <a href="/credit/charge" class="bg-primary">충전하기</a>
    <a href="/credit/withdraw" class="bg-primary">출금하기</a>
  
    <h1>크레딧 내역</h1>
    <table>
      <thead>
        <tr>
          <th>날짜</th>
          <th>이벤트 타입</th>
          <th>변동 크레딧</th>
          <th>잔여 크레딧</th>
        </tr>
      </thead>
      <tbody>
        {#each creditLogs as log}
          <tr>
            <td>{new Date(log.createDate).toLocaleDateString('ko-KR', )}</td>
            <td>{log.eventType}</td>
            <td>{log.creditChangeAmount}</td>
            <td>{log.restCredit}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>