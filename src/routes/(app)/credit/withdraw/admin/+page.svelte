<script lang="ts">
	import { onMount } from 'svelte';
	import Withdraws from '../../Withdraws.svelte';
  import { loginUsername } from "$components/store.js";


	let withdraws: any[] = [];

	onMount(async () => {

    if ($loginUsername !== 'admin') {
      alert('접근 권한이 없습니다.')
      window.location.href = '../';
      return;
    }

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

  async function approveWithdraw(withdrawId: number) {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!accessToken) {
        throw new Error('AccessToken이 없습니다.');
      }

      const response = await fetch(`http://localhost:8090/admin/credit/withdraws/${withdrawId}/do`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('네트워크 오류: ' + response.statusText);
      }

      window.location.reload();

    } catch (error) {
      console.error('출금 승인 오류:', error);
    }
  }

  async function rejectWithdraw(withdrawId: number) {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!accessToken) {
        throw new Error('AccessToken이 없습니다.');
      }

      const response = await fetch(`http://localhost:8090/admin/credit/withdraws/${withdrawId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('네트워크 오류: ' + response.statusText);
      }

      window.location.reload();
      
    } catch (error) {
      console.error('출금 거절 오류:', error);
    }
  }
</script>


<div class="container my-4 space-y-4">
  <div class="card-body bg-base-200">
    <p class="text-3xl font-extrabold mb-3">출금 신청 내역</p>
    <table class="table">
        <thead class="bg-gray-200 text-center text-base font-bold">
          <tr>
            <th>날짜</th>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>출금신청액</th>
            <th>처리상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="text-center">
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
                <button class='btn btn-success btn-sm' on:click={() => approveWithdraw(withdraw.id)}>승인</button>
                <button class='btn btn-error btn-sm' on:click={() => rejectWithdraw(withdraw.id)}>거절</button>
            </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
</div>