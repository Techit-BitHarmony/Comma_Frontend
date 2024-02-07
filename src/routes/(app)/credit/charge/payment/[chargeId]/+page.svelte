<script>
  import PaymentComponent from './PaymentComponent.svelte';
  import { onMount } from 'svelte';


let username = ''; 
let chargeAmount = ''; 
let chargeCode = ''; 

onMount(async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('AccessToken이 없습니다.');
        }
  
        const response = await fetch('http://localhost:8090/credit/charges/29', {
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
        username = resp.username;
        chargeCode = resp.chargeCode;
        chargeAmount = resp.chargeAmount;
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    });
</script>

<div>
  <h1>페이지 제목</h1>
  {#if username && chargeAmount && chargeCode}
    <PaymentComponent username={username} chargeAmount={chargeAmount} chargeCode={chargeCode}  />
  {:else}
    <p>Loading...</p>
  {/if}
</div>