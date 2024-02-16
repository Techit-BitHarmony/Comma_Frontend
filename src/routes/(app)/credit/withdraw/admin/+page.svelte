<script lang="ts">
	import { onMount } from 'svelte';
	import { loginUsername } from '$components/store.js';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';
	import { writable } from 'svelte/store';

	let withdraws = writable<any[]>([]);
	let currentPage = writable(1);
	let totalPages = writable(1);
	let itemsPerPage = 10;
	let totalElements = '';

	onMount(async () => {
		loadWithdraws();
	});

	async function loadWithdraws() {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const withdrawsResponse = await fetch(
				$baseUrl + `/admin/credit/withdraws?page=${$currentPage}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					}
				}
			);

			const withdrawsResp = await withdrawsResponse.json();

			if (!withdrawsResponse.ok) {
				toastWarning(withdrawsResp.message);
				await goto('/credit')
				return;
			}

			withdraws.set(withdrawsResp.withdraws.content);

			const totalWithdraws = withdrawsResp.withdraws.totalElements;
			totalElements = totalWithdraws;
			totalPages.set(Math.ceil(totalWithdraws / itemsPerPage));
		} catch (error) {
			toastWarning('출금 신청 내역을 불러오는 데 실패하였습니다.');
		}
	}

	async function approveWithdraw(withdrawId: number) {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch($baseUrl + `/admin/credit/withdraws/${withdrawId}/do`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return; 
			}

			toastNotice('출금 승인 성공');

			await loadWithdraws();
		} catch (error) {
			toastWarning('출금 승인에 실패하였습니다.');
		}
	}

	async function rejectWithdraw(withdrawId: number) {
		try {
			const accessToken = getCookie('accessToken');

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const response = await fetch($baseUrl + `/admin/credit/withdraws/${withdrawId}/reject`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

			const resp = await response.json();

			if (!response.ok) {
				toastWarning(resp.message);
				return; 
			}

			toastNotice('출금 거절 성공');

			await loadWithdraws();
		} catch (error) {
			toastWarning('출금 거절에 실패하였습니다.');
		}
	}

	function previousPage() {
		currentPage.update((n) => Math.max(n - 1, 1));
		loadWithdraws();
	}

	function nextPage() {
		currentPage.update((n) => n + 1);
		loadWithdraws();
	}

	function movePage(pageNumber: any) {
		currentPage.set(pageNumber);
		loadWithdraws();
	}
</script>

<div class="container my-4 space-y-4">
	<div class="card-body bg-base-100 dark:bg-gray-800">
		<p class="text-3xl text-primary-dark dark:text-primary font-extrabold mb-3">출금 신청 내역</p>
		<table class="table">
			<thead class="bg-gray-200 text-center text-base font-bold">
				<tr>
					<th>날짜</th>
					<th>신청인</th>
					<th>은행명</th>
					<th>계좌번호</th>
					<th>출금신청액</th>
					<th>처리상태</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-center">
				{#each $withdraws as withdraw}
					<tr>
						<td>{new Date(withdraw.applyDate).toLocaleDateString('ko-KR')}</td>
						<td>{withdraw.applicantName}</td>
						<td>{withdraw.bankName}</td>
						<td>{withdraw.bankAccountNo}</td>
						<td>{withdraw.withdrawAmount}</td>
						<td>
							{#if withdraw.withdrawDoneDate}
								출금 완료
							{/if}
							{#if withdraw.withdrawCancelDate}
								출금 거절
							{/if}
							{#if withdraw.withdrawDoneDate === null && withdraw.withdrawCancelDate === null}
								미처리
							{/if}
						</td>
						{#if withdraw.withdrawDoneDate === null && withdraw.withdrawCancelDate === null}
							<td>
								<button class="btn btn-success btn-sm" on:click={() => approveWithdraw(withdraw.id)}
									>승인</button
								>
								<button class="btn btn-error btn-sm" on:click={() => rejectWithdraw(withdraw.id)}
									>거절</button
								>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="join flex justify-center">
			{#if $totalPages > 0}
				<button class="join-item btn btn-square" on:click={previousPage}
					><i class="fa-solid fa-caret-left" /></button
				>
			{/if}
			{#each Array.from({ length: $totalPages }, (_, index) => index + 1) as pageNumber}
				{#if pageNumber === $currentPage}
					<button class="join-item btn btn-square btn-active" on:click={() => movePage(pageNumber)}
						>{pageNumber}</button
					>
				{:else}
					<button class="join-item btn btn-square" on:click={() => movePage(pageNumber)}
						>{pageNumber}</button
					>
				{/if}
			{/each}
			{#if $totalPages > $currentPage}
				<button class="join-item btn btn-square" on:click={nextPage}
					><i class="fa-solid fa-caret-right" /></button
				>
			{/if}
		</div>
	</div>
</div>
