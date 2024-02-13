<script lang="ts">
	import { onMount } from 'svelte';
	import Withdraws from '../../Withdraws.svelte';

	let withdraws: any[] = [];
    let withdrawId = '';

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

			const withdrawsResponse = await fetch('http://localhost:8090/admin/credit/withdraws', {
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
    <h1>{withdrawId}</h1>
    <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>출금신청액</th>
            <th>처리상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each withdraws as withdraw}
            <tr>
              <td>{new Date(withdraw.applyDate).toLocaleDateString('ko-KR', )}</td>
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
                <a class='btn btn-outline' href='http://localhost:8090/admin/credit/withdraws/{withdraw.id}/do'>승인</a>
                <a class='btn btn-outline' href='http://localhost:8090/admin/credit/withdraws/{withdraw.id}/reject'>거절</a>
            </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
</div>