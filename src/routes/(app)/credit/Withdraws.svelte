<!-- WithdrawalLogs.svelte -->
<script lang="ts">
	export let withdraws: any[] = [];
</script>

<div class="card bg-base-100 dark:bg-gray-800 p-4">
	<p class="text-3xl text-primary-dark dark:text-primary font-extrabold mb-3">출금 신청 내역</p>
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
