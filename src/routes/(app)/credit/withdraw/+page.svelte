<script lang="ts">
	import { onMount } from 'svelte';
	import {page} from "$app/stores";
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
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

			const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

			if (!accessToken) {
				toastWarning('로그인 해주세요.');
			}

			try {
				const response = await fetch($baseUrl + '/credit/withdraws', {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					},
					body: JSON.stringify({ bankName, bankAccountNo, withdrawAmount })
				});

				const resp = await response.json();

				if (!response.ok) {
					toastWarning(resp.message);
					return; 
				}

				toastNotice('출금 신청 성공');

				await goto('/credit');
			} catch (error) {
				toastWarning('출금 신청하는 데 실패하였습니다.')
			}
		});
	});
</script>

<div class="container bg-base-100 dark:bg-gray-800 my-4 w-full">
	<div class="card card-body">
		<div>
			<p class="font-extrabold text-primary-dark dark:text-primary text-3xl mb-3">출금 신청</p>
		</div>
		<form id="withdrawForm">
			<div class="mt-5">
				<label for="bankName" class="text-primary-dark dark:text-primary me-2"><i class="fa-solid fa-building-columns me-3"></i>은행명 </label>
				<select
					class="select select-bordered w-full max-w-xs bg-base-100 dark:bg-gray-600 text-primary-dark dark:text-primary ms-12"
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
				<label class="text-primary-dark dark:text-primary" for="bankAccountNo"><i class="fa-solid fa-money-check-dollar me-3"></i> 계좌번호 </label>
				<input
					class="input input-bordered w-10/12 max-w-xs bg-base-100 dark:bg-gray-600 ms-10"
					type="text"
					name="bankAccountNo"
					id="bankAccountNo"
					placeholder="계좌번호를 입력하세요 ('-' 없이)"
					required
				/>
			</div>
			<div class="mt-5">
				<label class="text-primary-dark dark:text-primary" for="withdrawAmount"><i class="fa-solid fa-sack-dollar me-3"></i>출금신청액 </label>
				<input
					class="input input-bordered w-10/12 max-w-xs bg-base-100 dark:bg-gray-600 ms-6"
					type="text"
					name="withdrawAmount"
					id="withdrawAmount"
					placeholder="금액을 입력하세요"
					required
				/>
			</div>
			<div class="flex justify-center">
				<button class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-5" type="submit"><i class="fa-solid fa-check"></i>출금 신청하기</button>
			</div>
		</form>
	</div>
</div>
