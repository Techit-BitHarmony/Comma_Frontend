<script lang="ts">
	import { onMount } from 'svelte';
	import CreditLogs from './CreditLogs.svelte';
	import Withdraws from './Withdraws.svelte';

	let restCredit = '';
	let creditLogs: any[] = [];
	let withdraws: any[] = [];

	// 페이지 로드 시 서버에서 데이터를 가져옴
	onMount(async () => {
		try {
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			const response = await fetch('http://localhost:8090/credit/creditlogs/mine', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			if (!response.ok) {
				throw new Error('네트워크 오류: ' + response.statusText);
			}

			const resp = await response.json();
			restCredit = resp.restCredit;
			creditLogs = resp.creditLogDtos;

			const withdrawsResponse = await fetch('http://localhost:8090/credit/withdraws/mine', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			if (!withdrawsResponse.ok) {
				throw new Error('네트워크 오류: ' + withdrawsResponse.statusText);
			}

			const withdrawResp = await withdrawsResponse.json();
			withdraws = withdrawResp.withdraws;
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
	<CreditLogs {creditLogs} />

	<h1>출금 신청 내역</h1>
	<Withdraws {withdraws} />
</div>
