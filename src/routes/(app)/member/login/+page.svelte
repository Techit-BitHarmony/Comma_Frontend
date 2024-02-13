<script>
  import {baseUrl} from "$components/store.js";
  import {toastWarning} from "$components/toastr.js";
  import {goto} from "$app/navigation";
  import {setTokenCookie, checkAccessToken} from "$components/token.js";
  import {loginUsername} from "$components/store.js";

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (formData) {
      const jsonData = {};
      for (let pair of formData.entries()) {
        jsonData[pair[0]] = pair[1];
      }

      const response = await fetch(`${$baseUrl}/member/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.username) { // @Valid 로 처리 된 내용
          toastWarning(errorData.message);
          return;
        }

        if (errorData.password) { // @Valid 로 처리 된 내용
          toastWarning(errorData.message);
          return;
        }

        toastWarning(errorData.message); // Exception 으로 처리 된 message
        return;
      }

      const responseData = await response.json();
      const { username, accessToken, refreshToken } = responseData.data;


      setTokenCookie('accessToken', accessToken, 1);
      setTokenCookie('refreshToken', refreshToken, 24 * 7);

      loginUsername.update(store => {
        store = username;
      return store;}
  )

      checkAccessToken();
      await goto("/");
    }
  }
</script>

<div class="container my-4 space-y-4">
  <div class="pl-10 pr-10">
    <div class="flex flex-col">
      <h2 class="text-3xl font-bold border-bottom py-2 m-5 text-center dark:text-primary">로그인</h2>
      <form on:submit="{handleSubmit}" method="post">
        <div class="flex flex-col m-5">
          <label for="email" class="form-label">아이디</label>
          <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full" name="username" id="username" type="text" placeholder="이메일을 입력해주세요."/>
        </div>
        <div class="flex flex-col m-5">
          <label for="password" class="form-label">비밀번호</label>
          <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full" name="password" id="password" type="password" placeholder="비밀번호를 입력해주세요."/>
        </div>
        <div class="flex flex-col m-5">
          <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3">로그인</button>
        </div>
        <div class="flex flex-col m-5 items-center">
          <span class="text-center text-opacity-30"> ----- 처음 이용하시나요? ----- </span>
          <a class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3 w-6/12" href="/member/join">회원가입</a>
        </div>
      </form>
    </div>
  </div>
</div>
