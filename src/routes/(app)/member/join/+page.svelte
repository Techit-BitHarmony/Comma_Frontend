<script>
	import { baseUrl } from '$components/store.js';
	import { toastWarning } from '$components/toastr.js';
	import { toastNotice } from '$components/toastr';
	import { goto } from '$app/navigation';

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		if (formData) {
			const jsonData = {};
			for (let pair of formData.entries()) {
				jsonData[pair[0]] = pair[1];
			}

			const response = await fetch(`${$baseUrl}/member/join`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(jsonData)
			});

			if (!response.ok) {
				const errorData = await response.json();

				if (errorData.validMessages !== null) {
					if (errorData.validMessages.username) {
						// @Valid 로 처리 된 내용
						toastWarning(errorData.validMessages.username);
						return;
					}

					if (errorData.validMessages.password) {
						// @Valid 로 처리 된 내용
						toastWarning(errorData.validMessages.password);
						return;
					}
					if (errorData.validMessages.passwordCheck) {
						// @Valid 로 처리 된 내용
						toastWarning(errorData.validMessages.passwordCheck);
						return;
					}
					if (errorData.validMessages.nickname) {
						// @Valid 로 처리 된 내용
						toastWarning(errorData.validMessages.nickname);
						return;
					}
					if (errorData.validMessages.email) {
						// @Valid 로 처리 된 내용
						toastWarning(errorData.validMessages.email);
						return;
					}
				}
				toastWarning(errorData.message); // Exception 으로 처리 된 message
				return;
			}

			const responseData = await response.json();

			toastNotice('회원가입이 완료되었습니다.');
			await goto('/member/login');
		}
	}
</script>

<div class="container my-4 space-y-4">
	<div class="pl-10 pr-10">
		<div class="flex flex-col mb-5">
			<h2 class="text-3xl font-bold border-bottom py-2 m-5 text-center dark:text-primary">
				회원가입
			</h2>
			<form on:submit={handleSubmit} method="post">
				<div class="flex flex-col m-5">
					<label for="username" class="form-label">아이디</label>
					<input
						class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
						name="username"
						id="username"
						type="text"
						placeholder="아이디를 입력해주세요."
					/>
				</div>
				<div class="flex flex-col m-5">
					<label for="password" class="form-label">비밀번호</label>
					<input
						class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
						name="password"
						id="password"
						type="password"
						placeholder="비밀번호를 입력해주세요."
					/>
				</div>
				<div class="flex flex-col m-5">
					<label for="passwordCheck" class="form-label">비밀번호 확인</label>
					<input
						class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
						name="passwordCheck"
						id="passwordCheck"
						type="password"
						placeholder="비밀번호를 재입력해주세요."
					/>
				</div>
				<div class="flex flex-col m-5">
					<label for="nickname" class="form-label">닉네임</label>
					<input
						class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
						name="nickname"
						id="nickname"
						type="text"
						placeholder="닉네임를 입력해주세요."
					/>
				</div>
				<div class="flex flex-col m-5">
					<label for="email" class="form-label">이메일</label>
					<input
						class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
						name="email"
						id="email"
						type="text"
						placeholder="이메일을 입력해주세요."
					/>
				</div>
				<div class="flex flex-col m-5">
					<button
						type="submit"
						class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3"
						>회원가입</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
