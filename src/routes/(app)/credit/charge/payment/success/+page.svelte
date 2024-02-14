<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';

	let _amount = $page.url.searchParams.get('amount');
	let _orderId = $page.url.searchParams.get('orderId');
	let _paymentKey = $page.url.searchParams.get('paymentKey');

	onMount(async () => {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const requestData = {
				paymentKey: _paymentKey,
				orderId: _orderId,
				amount: _amount
			};

			const response = await fetch($baseUrl + '/credit/confirm', {
				method: 'POST',
        credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				},
				body: JSON.stringify(requestData)
			});

			const json = await response.json();

			if (!response.ok) {
				goto(`/credit/charge/payment/fail?message=${json.message}&code=${json.code}`);
				return;
			}
      
      toastNotice('결제가 완료되었습니다.');
			await goto('/credit?msg=결제가 완료되었습니다.');

		} catch (error) {
      toastWarning('결제에 실패하였습니다.');
		}
	});
</script>

<div class="container my-4 space-y-4">
	<div class="card-body bg-base-100">
    <h2>결제 성공</h2>
    <p>{_orderId}</p>
    <p>{_amount}</p>
    <p>{_paymentKey}</p>
		<a class="btn btn-primary mt-3" href="/credit">돌아가기</a>
	</div>
</div>
