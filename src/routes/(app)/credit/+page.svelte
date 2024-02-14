<script lang="ts">
	import { onMount } from 'svelte';
	import CreditLogs from './CreditLogs.svelte';
	import Withdraws from './Withdraws.svelte';
	import { getCookie } from '$components/token.js';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { loginUsername } from "$components/store.js";

	let restCredit = '';
	let creditLogs: any[] = [];
	let withdraws: any[] = [];

	// 페이지 로드 시 서버에서 데이터를 가져옴
	onMount(async () => {
		try {
			const accessToken = getCookie("accessToken");

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const creditLogsResponse = await fetch($baseUrl + `/credit/creditlogs/mine`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const creditLogsResp = await creditLogsResponse.json();

			if (!creditLogsResponse.ok) {
				toastWarning(creditLogsResp.message)
			}

			restCredit = creditLogsResp.restCredit;
			creditLogs = creditLogsResp.creditLogDtos;

			const withdrawsResponse = await fetch('http://localhost:8090/credit/withdraws/mine', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const withdrawsResp = await withdrawsResponse.json();

			if (!withdrawsResponse.ok) {
				toastWarning(withdrawsResp.message)
			}

			withdraws = withdrawsResp.withdraws;
		} catch (error) {
			toastWarning('정보를 불러오는 데에 실패하였습니다.')
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
			{#if $loginUsername === '프로필'}
			<a href="/credit/withdraw/admin" class="btn bg-warning">관리자 페이지</a>
			{/if}
		</div>
	</div>

	<div class="divider"></div>
	<CreditLogs {creditLogs} />
	<div class="divider"></div>
	<Withdraws {withdraws} />
</div>
