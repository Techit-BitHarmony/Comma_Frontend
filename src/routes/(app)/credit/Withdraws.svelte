<!-- WithdrawalLogs.svelte -->
<script lang="ts">
    export let withdraws: any[] = [];
</script>


<table>
    <thead>
      <tr>
        <th>날짜</th>
        <th>은행명</th>
        <th>계좌번호</th>
        <th>출금신청액</th>
        <th>처리상태</th>
      </tr>
    </thead>
    <tbody>
      {#each withdraws as withdraw}
        <tr>
          <td>{new Date(withdraw.applyDate).toLocaleDateString('ko-KR', )}</td>
          <td>{withdraw.bankName}</td>
          <td>{withdraw.bankAccountNo}</td>
          <td>{withdraw.withdrawAmount}</td>
          {#if withdraw.withdrawDoneDate}
          <td>{withdraw.processResult} <br/> {new Date(withdraw.withdrawDoneDate).toLocaleDateString('ko-KR')}</td>
          {/if}
          {#if withdraw.withdrawCancelDate}
          <td>{withdraw.processResult} <br/> {new Date(withdraw.withdrawCancelDate).toLocaleDateString('ko-KR')}</td>
          {/if}
          {#if withdraw.withdrawDoneDate === null && withdraw.withdrawCancelDate === null}
          <td>처리중</td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
