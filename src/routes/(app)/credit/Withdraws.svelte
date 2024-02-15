<!-- WithdrawalLogs.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getCookie } from '$components/token.js';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

	export let withdraws: any[] = [];

	onMount(async () => {
		try {
			loadWithdraws(); 
		} catch (error) {
			toastWarning('정보를 불러오는 데에 실패하였습니다.');
		}
	});

	

	async function loadWithdraws(){
		const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
				return;
			}

			const withdrawsResponse = await fetch($baseUrl +'/credit/withdraws/mine', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const withdrawsResp = await withdrawsResponse.json();

			if (!withdrawsResponse.ok) {
				toastWarning(withdrawsResp.message);
			}

			withdraws = withdrawsResp.withdraws;
	}
</script>

<div class="card bg-base-100 dark:bg-gray-800 p-4">
	<p class="text-3xl text-primary-dark dark:text-primary font-extrabold mb-3"><i class="fa-solid fa-wallet me-3"></i>출금 신청 내역</p>
	<table class="table">
		<thead class="bg-gray-200 dark:bg-gray-600 text-center text-primary-dark dark:text-primary text-lg font-bold">
			<tr>
				<th>날짜</th>
				<th>은행명</th>
				<th>계좌번호</th>
				<th>출금신청액</th>
				<th>처리상태</th>
			</tr>
		</thead>
		<tbody class="text-center text-primary-dark dark:text-primary">
			{#each withdraws as withdraw}
				<tr>
					<td>{new Date(withdraw.applyDate).toLocaleDateString('ko-KR')}</td>
					<td>{withdraw.bankName}</td>
					<td>{withdraw.bankAccountNo}</td>
					<td>{withdraw.withdrawAmount}</td>
					{#if withdraw.withdrawDoneDate}
						<td
							>{withdraw.processResult} <br />
							{new Date(withdraw.withdrawDoneDate).toLocaleDateString('ko-KR')}</td
						>
					{/if}
					{#if withdraw.withdrawCancelDate}
						<td
							>{withdraw.processResult} <br />
							{new Date(withdraw.withdrawCancelDate).toLocaleDateString('ko-KR')}</td
						>
					{/if}
					{#if withdraw.withdrawDoneDate === null && withdraw.withdrawCancelDate === null}
						<td>처리중</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
	{#if withdraws.length === 0}
		<p class="flex justify-center">출금 신청 내역이 없습니다</p>
	{/if}
</div>
