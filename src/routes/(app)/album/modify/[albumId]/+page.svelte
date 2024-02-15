<script>
    import { page } from '$app/stores';
    import { baseUrl } from "$components/store.js";
    import { toastWarning, toastNotice } from "$components/toastr.js";
    import { getCookie } from "$components/token.js";
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';

    let albumname = $state(""); // 앨범 제목을 저장하는 변수
    let genre = $state("default"); // 앨범 장르를 저장하는 변수
    let licenseChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let licenseDescription = $state("해당 곡의 라이센스"); // 라이센스 설명을 저장하는 변수
    let permitChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let price = $state(0); // 가격을 저장하는 변수
    let musicImageFile;
    let albumid = $page.params.albumId;

    onMount(async () => {
        try {
            const memberResponse = await fetch(`${$baseUrl}/member/mypage`, {
                method: 'GET',
                headers: {
                    'Authorization': getCookie('accessToken'),
                },
            });

            const albumResponse = await fetch(`${$baseUrl}/album/detail/${albumid}`, {
                method: 'GET'
            });

            const albumResponseData = await albumResponse.json();
            const memberResponseData = await memberResponse.json();

            if (!memberResponse.ok) {
                toastWarning(memberResponseData.message);
                await goto("/");
                return;
            }

            if (!albumResponse.ok) {
                toastWarning(albumResponseData.message);
                await goto("/");
                return;
            }

            if(albumResponseData.data.artistUsername !== memberResponseData.data.username) {
                toastWarning(albumResponseData.message);
                await goto("/");
                return;
            }

            albumname = albumResponseData.data.albumname;
            genre = albumResponseData.data.genre;
            licenseChecked = albumResponseData.data.license;
            licenseDescription = albumResponseData.data.licenseDescription;
            permitChecked = albumResponseData.data.permit;
            price = albumResponseData.data.price;

            if(albumResponseData.data.imgPath !== null) document.getElementById('albumCover').src = albumResponseData.data.imgPath;

            document.getElementById('albumname').value = albumname;
            document.getElementById('license').checked = licenseChecked;
            document.getElementById('permit').checked = permitChecked;

            const genreElement = document.getElementById('genre');
            if (genreElement && genreElement instanceof HTMLSelectElement) {
                genreElement.value = albumResponseData.data.genre;
            }

            const licenseDescriptionElement = document.getElementById('licenseDescription');
            if (licenseDescriptionElement && licenseDescriptionElement instanceof HTMLTextAreaElement) {
                licenseDescriptionElement.value = albumResponseData.data.licenseDescription;
            }

            const priceElement = document.getElementById('price');
            if (priceElement && priceElement instanceof HTMLInputElement) {
                priceElement.value = albumResponseData.data.price;}
        } catch (error) {
            toastWarning("앨범 정보를 불러오는데 실패했습니다.");
            await goto("/");
            return;
        }
    });

    async function editFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData();

        if (formData) {
            formData.append('albumname', albumname);
            formData.append('genre', genre);
            formData.append('license', licenseChecked ? 'true' : 'false');
            formData.append('licenseDescription', licenseDescription);
            formData.append('permit', permitChecked ? 'true' : 'false');
            formData.append('price', price.toString());

            if (musicImageFile) {
                formData.append('musicImageFile', musicImageFile);
            }

            const response = await fetch(`${$baseUrl}/album/${albumid}`, {
                method: 'PUT',
                headers: {
                    'Authorization': getCookie('accessToken'),
                },
                credentials: 'include',
                body: formData,
            });

            const responseData = await response.json();
            if (!response.ok) {

                if (responseData.albumname) {
                    toastWarning(responseData.message);
                }

                toastWarning(responseData.message);
                return;
            }

            //TODO 나중에 앨범 수정 성공시 앨범 상세 페이지로 이동하게 변경
            toastNotice('앨범이 성공적으로 수정되었습니다.');
            await goto("/");
        }
    }

    function handleImageFileChange(event) {
        const statElement = document.getElementById('stat');
        const file = event.target.files[0];
        if (!file) return;

        // 파일 확장자 가져오기
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // 확장자 제한
        const allowedExtensions = ['jpg', 'jpeg', 'png'];

        // 확장자가 아니라면 오류
        if (!allowedExtensions.includes(fileExtension)) {
            if (statElement) statElement.innerHTML = '사용할 수 없는 파일입니다.';
            toastWarning('사용할 수 없는 파일입니다.');
            return;
        }

        //TODO 나중에 이미지 업로드되면 미리보기 바뀌게 하고싶은데..

        musicImageFile = file;
    }
</script>


<div class="container my-4 space-y-4">
    <div class="pl-10 pr-10">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center items-center mt-8">
                <h1 class="text-5xl text-left">나만의 앨범 수정하기</h1>
                <h2 class="text-sm font-bold">나만의 앨범을 수정 하세요!</h2>
            </div>

            <div class="divider"></div>

            <form on:submit="{editFormSubmit}" method="post" class="flex flex-row">
                <!-- Left Section -->
                <div class="flex flex-col m-5 w-1/2 relative">
                    앨범 이미지
                    <span class="block w-64 h-64 relative">
                        <img id="albumCover" class="w-full h-full object-cover" src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg" alt="Album Cover" />
                        <input class="mt-2 mb-10" type="file" id="musicImageFile" name="musicImageFile" on:change={handleImageFileChange}>
                    </span>
                </div>

                <!-- Right Section -->
                <div class="flex flex-col m-5 w-1/2">
                    제목
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 mb-3 max-w-full" name="albumname" id="albumname" placeholder="제목을 입력해주세요." bind:value={albumname}>

                    곡 장르
                    <select class="select select-bordered bg-gray-light dark:bg-gray-dark w-full max-w-xs mb-3" name="genre" bind:value={genre}>
                        <option disabled selected>장르를 선택해주세요.</option>
                        <option value="default">기본</option>
                        <option value="rock">락</option>
                        <option value="pop">팝</option>
                        <option value="jazz">재즈</option>
                        <option value="classical">클래식</option>
                        <!-- Add more options as needed -->
                    </select>

                    <!-- 라이센스 -->
                    라이센스
                    <input class="checkbox  mb-3" type="checkbox" id="license" name="license" bind:checked={licenseChecked}>

                    <!-- 라이센스 설명 -->
                    {#if licenseChecked} <!-- 라이센스 체크박스가 체크되어 있을 때만 라이센스 설명창을 표시 -->
                        라이센스 설명
                        <textarea class="textarea textarea-bordered bg-gray-light dark:bg-gray-dark  mb-3" id="licenseDescription" name="licenseDescription" bind:value={licenseDescription}></textarea>
                    {/if}

                    <!-- 유료 전환 -->
                    유료 전환
                    <input class="checkbox  mb-3" type="checkbox" id="permit" name="permit" bind:checked={permitChecked}>

                    <!-- 가격 -->
                    {#if permitChecked} <!-- 유료 전환 체크박스가 체크되어 있을 때만 가격 입력 필드를 표시 -->
                        가격
                        <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mb-3 max-w-full" type="number" id="price" name="price" min="0" bind:value={price}>
                    {/if}

                    <div class="flex flex-col m-5">
                        <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3 w-full">앨범 등록하기</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>