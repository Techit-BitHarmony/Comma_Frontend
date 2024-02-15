<script lang="ts">
	import { onMount } from 'svelte';
	import CreditLogs from './CreditLogs.svelte';
	import Withdraws from './Withdraws.svelte';
	import { getCookie } from '$components/token.js';
	import { goto } from '$app/navigation';
	import { baseUrl } from '$components/store.js';
	import { toastNotice } from '$components/toastr';
	import { toastWarning } from '$components/toastr';

</script>

<div class="container my-10 space-y-4">
	<div class="divider dark:divider-accent" />
	<CreditLogs />
	<div class="divider dark:divider-accent" />
	<Withdraws />
</div>
