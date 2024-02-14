<script lang="ts">
	import { onMount } from 'svelte';
	import Withdraws from '../../Withdraws.svelte';
  import { loginUsername } from "$components/store.js";
  import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';
	import { getCookie } from '$components/token.js';

	let withdraws: any[] = [];

	onMount(async () => {

    if ($loginUsername !== 'admin') {
      toastWarning('접근 권한이 없습니다.')
      await goto('/credit')
    }

    loadWithdraws(); 

	});

  async function loadWithdraws() {
    try {
			const accessToken = getCookie('accessToken'); 

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			const withdrawsResponse = await fetch($baseUrl + '/admin/credit/withdraws', {
				method: 'GET',
        credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${accessToken}`
				}
			});

      const withdrawResp = await withdrawsResponse.json();

			if (!withdrawsResponse.ok) {
        toastWarning(withdrawResp.message);
      			}

			withdraws = withdrawResp.withdraws;

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
      }

      toastNotice('출금 승인 성공')

      await loadWithdraws(); 

    } catch (error) {
      toastWarning('출금 승인에 실패하였습니다.');
    }
  }

  async function rejectWithdraw(withdrawId: number) {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];

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
      }

      toastNotice('출금 거절 성공')

      await loadWithdraws(); 
      
    } catch (error) {
      toastWarning('출금 거절에 실패하였습니다.');
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