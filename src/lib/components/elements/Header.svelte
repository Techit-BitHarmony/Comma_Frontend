<script>
import SelectTheme from "$components/layout/Theme.svelte";
import {loginUsername, isLogin, baseUrl} from "../store.js";
</script>

<div class="py-5 bg-gray-light dark:bg-gray-dark fixed inset-x-0 z-50 text-primary-dark dark:text-primary rounded-b-lg">
  <div class="container flex items-center justify-between">
    <div class="flex items-center space-x-4 sm:space-x-6 ml-5">
      <a href="/search" aria-label="Music Search"><i class="gg-search" /></a>
      <SelectTheme />
    </div>
    <div>
      <a href="/" class="text-2xl font-extrabold tracking-tight ring-2 px-2 py-1 ring-black dark:ring-primary hover:ring-primary dark:hover:ring-primary-light">
        COM,MA
      </a>
    </div>
    <div>
      {#if $isLogin}
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">{$loginUsername}</div>
          <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow rounded-box w-52 mt-4 bg-gray-light dark:bg-gray-dark">
            <li><a><i class="fa-solid fa-address-card"></i>마이페이지</a></li>
            <li><a><i class="fa-solid fa-door-closed"></i>로그아웃</a></li>
          </ul>
        </div>
        <span class="mr-3"></span>
      {:else}
        <a class="btn btn-ghost" href="/member/login">로그인</a>
      {/if}
    </div>
  </div>
</div>