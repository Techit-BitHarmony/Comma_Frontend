<script>
    import { baseUrl, loginUsername } from "$components/store.js";
    import { toastWarning, toastNotice } from "$components/toastr.js";
    import { getCookie } from "$components/token.js";
    import {goto} from "$app/navigation";
    import {onDestroy} from "svelte";

    let albumname = $state(""); // 앨범 제목을 저장하는 변수
    let filePath = $state(""); // 업로드된 파일의 URL을 저장하는 변수
    let genre = $state("default"); // 앨범 장르를 저장하는 변수
    let licenseChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let licenseDescription = $state("해당 곡의 라이센스"); // 라이센스 설명을 저장하는 변수
    let permitChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let price = $state(0); // 가격을 저장하는 변수
    let source = $state({});
    let musicImageFile;

    async function releaseFormSubmit(event) {
        const memberResponse = await fetch(`${$baseUrl}/member/mypage`, {
            method: 'GET',
            headers: {
                'Authorization': getCookie('accessToken'),
            },
        });

        if (!memberResponse.ok) {
            toastWarning("로그인이 필요한 서비스입니다.");
            await goto("/");
            return;
        }

        event.preventDefault();
        const formData = new FormData();

        if (formData) {
            formData.append('albumname', albumname);
            formData.append('filePath', filePath);
            formData.append('genre', genre);
            formData.append('license', licenseChecked ? 'true' : 'false');
            formData.append('licenseDescription', licenseDescription);
            formData.append('permit', permitChecked ? 'true' : 'false');
            formData.append('price', price.toString());

            if (musicImageFile) {
                formData.append('musicImageFile', musicImageFile);
            }

            const response = await fetch(`${$baseUrl}/album/release`, {
                method: 'POST',
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

            source = new EventSource($baseUrl + `/streaming/status?username=${$loginUsername}`);
            source.addEventListener('Encoding Status', handleEvent);
        }
    }

    async function handleEvent(event) {
        const data = JSON.parse(event.data);
        if (data[2] === "COMPLETE") {
            toastNotice('앨범이 성공적으로 등록되었습니다.');
            await goto("/");
        }
    }

    let musicFile = $state();
    let uploading = false;
    async function uploadMusicFile() {
        if (!musicFile) {
            toastWarning("음악 파일을 선택해주세요.");
            return;
        }


        const res = await fetch($baseUrl + `/streaming/upload?filename=${encodeURIComponent(musicFile.name)}`, {
            method: 'GET',
            headers: {
                'Authorization': getCookie('accessToken'),
            }
        });

        const statElement = document.getElementById('stat');

        if (res.ok) {
            const { data } = await res.json();

            // Presigned URL로 파일 업로드
            const uploadRes = await fetch(data.uploadUrl, { method: 'PUT', body: musicFile });

            if (uploadRes.ok) {
                filePath = data.uploadUrl;
                if (statElement) statElement.innerHTML = '업로드 성공!';
                toastNotice('업로드 성공!');
            } else {
                if (statElement) statElement.innerHTML = '업로드 실패!';
                toastWarning('업로드 실패!');
            }
        } else {
            if (statElement) statElement.innerHTML = 'Presigned URL을 받아오는 데 실패했습니다.';
            toastWarning('Presigned URL을 받아오는 데 실패했습니다.');
        }
    }

    function handleFileChange(event) {
        const statElement = document.getElementById('stat');
        const file = event.target.files[0];
        if (!file) return;

        // 파일 확장자 가져오기
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // 확장자 제한
        const allowedExtensions = ['mp3', 'wav', 'flac'];

        // 확장자가 아니라면 오류
        if (!allowedExtensions.includes(fileExtension)) {
            if (statElement) statElement.innerHTML = '사용할 수 없는 파일입니다.';
            toastWarning('사용할 수 없는 파일입니다.');
            return;
        }

        musicFile = file;
        uploading = true;

        // 파일 업로드 함수 호출
        uploadMusicFile().finally(() => {
            uploading = false;
        });
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

    onDestroy(() => {
        if (source) {
            source.removeEventListener('Encoding Status', handleEvent);
            source.close();
        }
    });
</script>


<div class="container my-4 space-y-4">
    <div class="pl-10 pr-10">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center items-center mt-8">
                <h1 class="text-5xl text-left">나만의 앨범 등록하기</h1>
                <h2 class="text-sm font-bold">나만의 앨범을 업로드 하세요!</h2>
            </div>

            <div class="divider"></div>

            <form on:submit="{releaseFormSubmit}" class="flex flex-row">
                <!-- Left Section -->
                <div class="flex flex-col m-5 w-1/2 relative">
                    앨범 이미지
                    <span class="block w-64 h-64 relative">
                        <img class="w-full h-full object-cover" src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg" alt="Album Cover" />
                        <input class="mt-2 mb-10" type="file" id="musicImageFile" name="musicImageFile" on:change={handleImageFileChange}>

                        음악 파일
                        <input class="mb-3" type="file" id="musicFile" name="musicFile" on:change={handleFileChange}>
                        <label for="musicFile" class="font-bold" id="stat">파일 업로드</label>
                        {#if uploading}
                            <span class="loading loading-spinner loading-md">파일 업로드 중...</span>
                        {/if}
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