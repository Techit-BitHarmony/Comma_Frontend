<script lang="ts">
	import { onMount } from 'svelte';
  import { toastNotice } from '$components/toastr';

	onMount(() => {
		const form = document.getElementById('chargeForm');

		form.addEventListener('submit', async function (event) {
			event.preventDefault(); // 기본 제출 행동 방지
			const chargeAmount = form.elements['chargeAmount'].value;
			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			try {
				const response = await fetch('http://localhost:8090/credit/charges', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ chargeAmount })
				});

				if (!response.ok) {
					throw new Error('네트워크 오류: ' + response.statusText);
				}

				const resp = await response.json();
				const chargeId = resp.chargeId;

        alert('결제창으로 이동합니다.')

				window.location.href = `/credit/charge/payment?chargeId=${chargeId}`;
			} catch (error) {
				console.error('충전 오류:', error);
				// 오류 메시지 표시 또는 사용자에게 다른 조치를 안내할 수 있습니다.
			}
		});
	});
</script>

<div class="container my-4 space-y-4">
	<div class="card-body bg-base-200">
		<form id="chargeForm">
			<div class="flex-auto">
				<label class="label text-2xl font-bold mb-2" for="chargeAmount">크레딧 충전</label>
				<select
					class="select select-bordered w-full max-w-xs mb-3"
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
			<button type="submit" class="btn bg-slate-300">충전하기</button>
		</form>
	</div>
</div>
