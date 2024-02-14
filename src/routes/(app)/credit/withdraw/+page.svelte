<script lang="ts">
	import { onMount } from 'svelte';
	import {page} from "$app/stores";
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

	let restCredit = $page.url.searchParams.get('restCredit');

	onMount(() => {
		const form = document.getElementById('withdrawForm');

		form?.addEventListener('submit', async function (event) {
			event.preventDefault();
			const bankName = form.elements['bankName'].value;
			const bankAccountNo = form.elements['bankAccountNo'].value;
			const withdrawAmount = form.elements['withdrawAmount'].value;

			if(parseInt(withdrawAmount) > parseInt(restCredit)){
				toastWarning(`보유한 크레딧(${restCredit})을 초과하여 신청할 수 없습니다.`)
				return; 
			}

			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				throw new Error('AccessToken이 없습니다.');
			}

			try {
				const response = await fetch('http://localhost:8090/credit/withdraws', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ bankName, bankAccountNo, withdrawAmount })
				});

				if (!response.ok) {
					toastWarning('출금 신청 실패');
					return; 
				}

				const resp = await response.json();

				alert('출금 신청 성공');

				window.location.href = '/credit';
			} catch (error) {
				console.error('충전 오류:', error);
			}
		});
	});
</script>

<div class="container bg-base-100 my-4 w-full">
	<div class="card card-body">
		<div>
			<p class="font-extrabold text-3xl mb-3">출금 신청</p>
		</div>
		<form id="withdrawForm">
			<div class="mt-5">
				<label for="bankName" class="me-2">은행명 </label>
				<select
					class="select select-bordered w-full max-w-xs ms-12"
					name="bankName"
					id="bankName"
					required
				>
					<option value="" disabled selected>은행을 선택하세요</option>
					<option value="신한은행">신한은행</option>
					<option value="국민은행">국민은행</option>
					<option value="하나은행">하나은행</option>
					<option value="우리은행">우리은행</option>
				</select>
			</div>
			<div class="mt-5">
				<label for="bankAccountNo">계좌번호 </label>
				<input
					class="input input-bordered w-10/12 max-w-xs ms-10"
					type="text"
					name="bankAccountNo"
					id="bankAccountNo"
					placeholder="계좌번호를 입력하세요 ('-' 없이)"
					required
				/>
			</div>
			<div class="mt-5">
				<label for="withdrawAmount">출금신청액 </label>
				<input
					class="input input-bordered w-10/12 max-w-xs ms-6"
					type="text"
					name="withdrawAmount"
					id="withdrawAmount"
					placeholder="금액을 입력하세요"
					required
				/>
			</div>
			<div class="flex justify-center">
				<button class="btn btn-success mt-5" type="submit">출금 신청하기</button>
			</div>
		</form>
	</div>
</div>
