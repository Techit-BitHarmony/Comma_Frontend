<script lang="ts">
	import { onMount } from 'svelte';
	import { getCookie } from '$components/token.js';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

	onMount(() => {
		const form = document.getElementById('chargeForm');

		form?.addEventListener('submit', async function (event) {
			event.preventDefault(); // 기본 제출 행동 방지
			const chargeAmount = form.elements['chargeAmount'].value;
			const accessToken = getCookie('accessToken'); 

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			try {
				const response = await fetch($baseUrl + `/credit/charges`, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ chargeAmount })
				});

				if (!response.ok) {
					toastWarning('주문서 생성 실패');
					return;
				}

				const resp = await response.json();
				const chargeId = resp.chargeId;

				toastNotice('결제창으로 이동합니다.');

				await goto(`/credit/charge/payment?chargeId=${chargeId}`)

			} catch (error) {
				toastWarning(error);
			}
		});
	});
</script>

<div class="container my-4 space-y-4">
	<div class="card-body bg-base-100 dark:bg-gray-800">
		<form id="chargeForm">
			<div class="flex-auto">
				<label class="label text-2xl text-primary-dark dark:text-primary font-bold mb-2" for="chargeAmount">크레딧 충전</label>
				<select
					class="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary mb-3"
					name="chargeAmount"
					id="chargeAmount"
					required
				>
					<option value="" disabled selected>충전할 금액을 선택하세요.</option>
					<option value="10000">10,000원</option>
					<option value="20000">20,000원</option>
					<option value="30000">30,000원</option>
					<option value="40000">40,000원</option>
					<option value="50000">50,000원</option>
				</select>
			</div>
			<button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost">충전하기</button>
		</form>
	</div>
</div>
