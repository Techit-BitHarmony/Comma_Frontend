<script>

    import { onMount } from 'svelte';
    import {baseUrl} from "$components/store.js";
	import { writable } from 'svelte/store';
    import {toastWarning, toastNotice} from "$components/toastr.js";
    import {goto} from "$app/navigation";

    let user = {
        "username" : writable(),
        "nickname" : writable(),
        "Email" : writable()
    }

    function getAccessToken(){
        const accessToken = document.cookie
				.split('; ')
				.find((row) => row.startsWith('accessToken='))
				?.split('=')[1];

		if (!accessToken) {
			throw new Error('AccessToken이 없습니다.');
		}

        return accessToken;
    }


	onMount(async () => {
		loadUser();
	});

    async function loadUser(){
        const accessToken = getAccessToken();

        const response = await fetch(`${$baseUrl}/member/mypage`, {
          method: 'GET',
          headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
			}
        });

        const responseData = await response.json();
       user = responseData.data;
    }

    async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const accessToken1 = getAccessToken();

    if (formData) {
      const jsonData = {};
      for (let pair of formData.entries()) {
        jsonData[pair[0]] = pair[1];
      }

      const response = await fetch(`${$baseUrl}/member/modify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${accessToken1}`
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.nickname) { // @Valid 로 처리 된 내용
          toastWarning(errorData.message);
          return;
        }

        if (errorData.Email) { // @Valid 로 처리 된 내용
          toastWarning(errorData.message);
          return;
        }

        toastWarning(errorData.message); // Exception 으로 처리 된 message
        return;
      }

      const responseData = await response.json();

      toastNotice("회원정보 수정이 완료되었습니다.");
      await goto("/member/user1/modify");
    }
  }

  async function gotoBack(){
    await goto("/");
  }
</script>


<div class="container my-4 space-y-4">
    <div class="pl-10 pr-10">
      <div class="flex flex-col">
        <h2 class="text-3xl font-bold border-bottom py-2 m-5 text-center dark:text-primary">마이페이지</h2>

            <form on:submit="{handleSubmit}" method="post">
                <div class="flex flex-row m-5">
                  <label for="username" class="form-label input input-bordered w-1/8 h-12 flex items-center justify-center mt-3 mr-1">아이디</label>
                  <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full w-3/4 h-12 flex items-center justify-center" name="username" id="username" type="text" readonly value="{user.username}"/>
                </div>
                <div class="flex flex-row m-5">
                    <label for="nickname" class="form-label input input-bordered w-1/8 h-12 flex items-center justify-center mt-3 mr-1">닉네임</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full w-3/4 h-12 flex items-center justify-center" name="nickname" id="nickname" type="text" value="{user.nickname}"/>
                  </div>
                  <div class="flex flex-row m-5">
                    <label for="email" class="form-label input input-bordered w-1/8 h-12 flex items-center justify-center mt-3 mr-1">이메일</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full w-3/4 h-12 flex items-center justify-center" name="email" id="email" type="text" value="{user.Email}"/>
                  </div>
                <div class="flex justify-center"> 
                        <div class="flex">
                            <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost py-2 px-4 mr-7">수정</button>
                            <button type="button" on:click="{gotoBack}" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost py-2 px-4">취소</button>
                        </div>
                </div>
            </form>
      </div>
    </div>
  </div>