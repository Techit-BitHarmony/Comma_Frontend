<script>
	import PaymentComponent from './PaymentComponent.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getCookie } from '$components/token.js';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

	let username = '';
	let chargeAmount = '';
	let chargeCode = '';
	let chargeId = $page.url.searchParams.get('chargeId');

	onMount(async () => {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch(`http://localhost:8090/credit/charges/${chargeId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				await goto('/credit/charge');
			}

			username = resp.username;
			chargeCode = resp.chargeCode;
			chargeAmount = resp.chargeAmount;
		} catch (error) {
			toastWarning('결제창을 불러오는 데 실패하였습니다.');
		}
	});
</script>

	<div class="card bg-base-200 max-w-[1000px] mx-auto mt-10">
		{#if username && chargeAmount && chargeCode}
			<PaymentComponent {username} {chargeAmount} {chargeCode} />
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
