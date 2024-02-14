<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

	let code = $page.url.searchParams.get('code');
	let message = $page.url.searchParams.get('message');
</script>

<div class="container my-4 space-y-4">
	<div class="card-body bg-base-100 dark:bg-gray-800">
		<h1 class="mb-3 text-primary-dark dark:text-primary">결제 실패</h1>
		<p class="text-primary-dark dark:text-primary">실패 코드 : {code}</p>
		<p class="text-primary-dark dark:text-primary">실패 원인 : {message}</p>

		<a class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3" href="/credit">돌아가기</a>
	</div>
</div>
