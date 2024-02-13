<script>
    import {baseUrl} from "$components/store.js";
    import {toastWarning, toastNotice} from "$components/toastr.js";
    import {goto} from "$app/navigation";
    import MypageNav from '$components/elements/MypageNav.svelte';

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

    async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const accessToken = getAccessToken();

    if (formData) {
      const jsonData = {};
      for (let pair of formData.entries()) {
        jsonData[pair[0]] = pair[1];
      }

      const response = await fetch(`${$baseUrl}/member/passwordModify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${accessToken}`
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.passwordModify) { // @Valid 로 처리 된 내용
          toastWarning(errorData.message);
          return;
        }

        if (errorData.Email) { // @Valid 로 처리 된 내용
          toastWarning(errorData.passwordModifyCheck);
          return;
        }

        toastWarning(errorData.message); // Exception 으로 처리 된 message
        return;
      }

      const responseData = await response.json();

      toastNotice("비밀번호 변경이 완료되었습니다.");
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
          <MypageNav />
          <div class="border-t border-gray-500"></div>
          <h2 class="text-3xl font-bold border-bottom py-2 m-5 text-center dark:text-primary">비밀번호 변경</h2>
          <div class="justify-center">
              <form on:submit="{handleSubmit}" method="post">
                  <div class="flex flex-row m-5">
                    <label for="passwordModify" class="form-label input input-bordered w-1/4 h-12 flex items-center justify-center mt-3 mr-1">비밀번호</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 w-full h-12 flex items-center justify-center" name="passwordModify" id="passwordModify" type="password" />
                  </div>
                  <div class="flex flex-row m-5">
                      <label for="passwordModifyCheck" class="form-label input input-bordered w-1/4 h-12 flex items-center justify-center mt-3 mr-1">비밀번호 확인</label>
                      <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 w-full h-12 flex items-center justify-center" name="passwordModifyCheck" id="passwordModifyCheck" type="password" />
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
</div>