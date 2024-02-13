<!-- CreditLogs.svelte -->
<script lang="ts">
	export let creditLogs: any[] = [];
</script>

<table>
	<thead>
		<tr>
			<th>날짜</th>
			<th>이벤트 타입</th>
			<th>변동 크레딧</th>
			<th>잔여 크레딧</th>
		</tr>
	</thead>
	<tbody>
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
