<script>
  import { onMount } from 'svelte';
  import {loginUsername} from "$components/store.js"

  let currentUrl = '';

  onMount(() => {
    currentUrl = window.location.pathname;
  });
</script>

<div class="flex flex-row mb-3">
    <div class="flex mr-3 ml-3 pr-2 border-r border-gray-500">
        <a class:highlight={currentUrl === `/member/${$loginUsername}/modify`} href="/member/{$loginUsername}/modify">마이페이지</a>
    </div>
    <div class="flex mr-3 pr-2 border-r border-gray-500">
        <a class:highlight={currentUrl === `/member/${$loginUsername}/modify/password`} href="/member/{$loginUsername}/modify/password">비밀번호 변경</a>
    </div>
    <div class="flex mr-3 pr-2 border-r border-gray-500">
        <a class:highlight={currentUrl === `/member/${$loginUsername}/credit`} href="/member/{$loginUsername}/credit">크레딧</a>
    </div>
    <div class="flex mr-3">
        <a class:highlight={currentUrl === `/member/${$loginUsername}/community`} href="/member/{$loginUsername}/community">커뮤니티</a>
    </div>
</div>

<style>

    .highlight:visited {
    color: white;
  }
</style>