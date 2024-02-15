<!-- CreditLogs.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getCookie } from '$components/token.js';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { loginUsername } from '$components/store.js';

	let restCredit = '';
	let creditLogs: any[] = [];

	onMount(async () => {
		try {
			loadCreditLogs(); 
		} catch (error) {
			toastWarning('정보를 불러오는 데에 실패하였습니다.');
		}
	});


	async function loadCreditLogs() {
		const accessToken = getCookie('accessToken');

		if (!accessToken) {
			toastWarning('로그인 해주세요.');
			return;
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
			toastWarning(creditLogsResp.message);
		}

		restCredit = creditLogsResp.restCredit;
		creditLogs = creditLogsResp.creditLogDtos;
	}
</script>

<div class="card bg-base-100 dark:bg-gray-800 p-2">
	<div class="flex ms-3 mb-3">
		<p class="text-3xl text-primary-dark dark:text-primary font-extrabold me-3">
			<i class="fa-solid fa-coins me-1" /> 현재 크레딧 :
		</p>
		<p class="text-3xl text-primary-dark dark:text-primary font-extrabold me-3">{restCredit}</p>
	</div>
	<div>
		<a
			href="/credit/charge"
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btn-wide"
			><i class="fa-solid fa-bolt me-2" /> 충전하기</a
		>
		<a
			href="/credit/withdraw/?restCredit={restCredit}"
			class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost btn-wide"
			><i class="fa-solid fa-money-bill-transfer me-2" />출금하기</a
		>
		{#if $loginUsername === 'admin'}
			<a href="/credit/withdraw/admin" class="btn btn-warning dark:btn-error">관리자 페이지</a>
		{/if}
	</div>
</div>

<div class="card bg-base-100 dark:bg-gray-800 p-4">
	<p class="text-3xl text-primary-dark dark:text-primary font-extrabold mb-3">
		<i class="fa-solid fa-clipboard me-3" />크레딧 내역
	</p>
	<table class="table">
		<thead
			class="bg-gray-200 dark:bg-gray-600 text-center text-primary-dark dark:text-primary text-lg font-bold"
		>
			<tr>
				<th>날짜</th>
				<th>이벤트 타입</th>
				<th>변동 크레딧</th>
				<th>잔여 크레딧</th>
			</tr>
		</thead>
		<tbody class="text-center text-primary-dark dark:text-primary">
			{#each creditLogs as log}
				<tr>
					<td>{new Date(log.createDate).toLocaleDateString('ko-KR')}</td>
					<td>{log.eventType}</td>
					<td>{log.creditChangeAmount}</td>
					<td>{log.restCredit}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if creditLogs.length === 0}
		<p class="flex justify-center">크레딧 내역이 없습니다</p>
	{/if}
</div>
