<!-- CreditLogs.svelte -->
<script lang="ts">
	export let creditLogs: any[] = [];
</script>

<div class="card bg-base-100 dark:bg-gray-800 p-4">
<p class="text-3xl text-primary-dark dark:text-primary font-extrabold mb-3"><i class="fa-solid fa-clipboard me-3"></i>크레딧 내역</p>
<table class="table">
	<thead class="bg-gray-200 dark:bg-gray-600 text-center text-primary-dark dark:text-primary text-lg font-bold">
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
