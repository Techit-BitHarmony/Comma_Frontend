<script lang="ts">
	import { onMount } from 'svelte';
	import CreditLogs from './CreditLogs.svelte';
	import Withdraws from './Withdraws.svelte';
	import { toastNotice } from '$components/toastr';
	import { loginUsername } from "$components/store.js";

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

<div class="container my-10 space-y-4">
	<div class="card bg-base-100 p-2">
		<div class="flex ms-3 mb-3">
			<p class="text-3xl font-extrabold me-3">현재 크레딧 :</p>
			<p class="text-3xl font-extrabold me-3">{restCredit}</p>
		</div>
		<div>
			<a href="/credit/charge" class="btn bg-base-200 btn-wide">충전하기</a>
			<a href="/credit/withdraw/?restCredit={restCredit}" class="btn bg-base-200 btn-wide">출금하기</a>
			{#if $loginUsername === 'admin'}
			<a href="/credit/withdraw/admin" class="btn bg-warning">관리자 페이지</a>
			{/if}
		</div>
	</div>

	<div class="divider"></div>
	<CreditLogs {creditLogs} />
	<div class="divider"></div>
	<Withdraws {withdraws} />
</div>
