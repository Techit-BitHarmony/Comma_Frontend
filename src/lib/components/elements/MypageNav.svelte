<script>
  import { onMount } from 'svelte';

  let currentUrl = '';

  onMount(() => {
    currentUrl = window.location.pathname;
  });
</script>

<div class="flex flex-row mb-3">
    <div class="flex mr-3 ml-3 pr-2 border-r border-gray-500">
        <a  class:highlight={currentUrl === '/member/user1/modify'} href="/member/user1/modify">마이페이지</a>
    </div>
    <div class="flex mr-3 pr-2 border-r border-gray-500">
        <a class:highlight={currentUrl === '/member/user1/modify/password'} href="/member/user1/modify/password">비밀번호 변경</a>
    </div>
    <div class="flex mr-3 pr-2 border-r border-gray-500">
        <a class:highlight={currentUrl === '/'} href="/">크레딧</a>
    </div>
    <div class="flex mr-3">
        <a class:highlight={currentUrl === '/'} href="/">커뮤니티</a>
    </div>
</div>

<style>
    
    .highlight:visited {
    /* 현재 URL과 일치하는 링크의 스타일 */
    color: white; /* 원하는 색상으로 변경 */
    /* 추가적인 스타일 적용 가능 */
  }
  </style>