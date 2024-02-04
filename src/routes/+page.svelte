<script>
  import {toastNotice, toastWarning} from "../toastr.js";

  function showNoticeToast() {
    toastNotice("알림입니다.");
  }

  function showWarningToast() {
    toastWarning("경고입니다.");
  }
</script>

<h1 class="text-3xl font-bold underline">
  Welcome to SvelteKit
</h1>
<h2 class="text-sky-500 hover:text-pink-700">
  열심히 해봅시다
</h2>

<br/>
<p class="text-primary">Visit to read the documentation</p>
<a class="btn btn-ghost" href="https://kit.svelte.dev">페이지 방문</a>

<a class="btn btn-primary" on:click={showNoticeToast}>알림 토스트</a>
<a class="btn btn-warning" on:click={showWarningToast}>경고 토스트</a>

<style>

</style>