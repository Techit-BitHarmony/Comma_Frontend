<script>
    import {page} from "$app/stores";
    import { onMount } from 'svelte';
  
  

  let _amount = $page.url.searchParams.get('amount');
  let _orderId = $page.url.searchParams.get('orderId');
  let _paymentKey = $page.url.searchParams.get('paymentKey');
   
  
  onMount(async () => {
        try {
          const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
        
          if (!accessToken) {
            throw new Error('AccessToken이 없습니다.');
          }

          const requestData = {
            paymentKey: _paymentKey,
            orderId: _orderId,
            amount: _amount,
        };
    
          const response = await fetch('http://localhost:8090/credit/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${accessToken}`
            },
            body: JSON.stringify(requestData)
          });
    
          const json = await response.json();

          if (!response.ok) {
            console.log(json);
            window.location.href = `/credit/payment/fail?message=${json.message}&code=${json.code}`;
            return;
        }
            
        window.location.replace('/credit?msg=결제가 완료되었습니다.');
            
        } catch (error) {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        }
      });
  </script>

  <div>
    <h2>결제 성공</h2>
    <p>{_orderId}</p>
    <p>{_amount}</p>
    <p>{_paymentKey}</p>
  </div>