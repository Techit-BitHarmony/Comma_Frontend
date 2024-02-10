<script>
    import { writable } from 'svelte/store';
    import { baseUrl } from "$components/store.js";
    import { toastWarning } from "$components/toastr.js";
    import { getCookie } from "$components/token.js";

    let licenseChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let permitChecked = $state(false); // 라이센스 체크박스의 상태를 저장하는 변수
    let licenseDescription = $state("해당 곡의 라이센스"); // 라이센스 설명을 저장하는 변수

    async function releaseFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        if (formData) {
            const formData = new FormData();
            for (let pair of formData.entries()) {
                formData.append(pair[0], pair[1]);
            }

            const response = await fetch(`${$baseUrl}/album/release`, {
                method: 'POST',
                headers: {
                    'Authorization': getCookie('accessToken'),
                },
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.albumname) {
                    toastWarning(errorData.message);
                }

                toastWarning(errorData.message);
                return;
            }

            const responseData = await response.json();
        }
    }

    let musicFile = $state();
    let uploading = false;
    async function uploadMusicFile() {
        if (!musicFile) {
            toastWarning("음악 파일을 선택해주세요.");
            return;
        }

        const res = await fetch(`http://localhost:8090/streaming/upload?filename=${encodeURIComponent(musicFile.name)}`, {
            method: 'GET',
            headers: {
                'Authorization': getCookie('accessToken'),
            },
        });

        if (res.ok) {
            const { data } = await res.json();

            // Presigned URL로 파일 업로드
            const uploadRes = await fetch(data.uploadUrl, { method: 'PUT', body: musicFile });

            //TODO 아래꺼 로딩으로 변경
            //완료시 MsgAlert로 변경
            //releaseFormsubmit에서 업로드 된 링크 없으면 반환

            if (uploadRes.ok) {
                alert('업로드 성공!');
            } else {
                alert('업로드 실패!');
            }
        } else {
            alert('Presigned URL을 받아오는 데 실패했습니다.');
        }
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        musicFile = file;
        uploading = true;

        // 파일 업로드 함수 호출
        uploadMusicFile().finally(() => {
            uploading = false;
        });
    }
</script>


<div class="container my-4 space-y-4">
    <div class="pl-10 pr-10">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center items-center mt-8">
                <h1 class="text-5xl text-left">나만의 앨범 등록하기</h1>
                <h2 class="text-sm font-bold">나만의 앨범을 업로드 하세요!</h2>
            </div>

            <div class="divider"></div>

            <form on:submit="{releaseFormSubmit}" method="post" class="flex flex-row">
                <!-- Left Section -->
                <div class="flex flex-col m-5 w-1/2 relative">
                    앨범 이미지
                    <span class="block w-64 h-64 relative">
                        <img class="w-full h-full object-cover" src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg" alt="Album Cover" />
                        <input class="mt-2 mb-10" type="file" id="musicImageFile" name="musicImageFile">

                        음악 파일
                        <input class="mb-3" type="file" id="musicFile" name="musicFile" on:change={handleFileChange}>
                        <label for="musicFile" class="font-bold">파일 업로드</label>
                                                {#if uploading}
                            <span class="loading loading-spinner loading-md">파일 업로드 중...</span>
                        {/if}
                    </span>
                </div>

                <!-- Right Section -->
                <div class="flex flex-col m-5 w-1/2">
                    제목
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 mb-3 max-w-full" name="albumname" id="albumname" placeholder="제목을 입력해주세요." value="">

                    곡 장르
                    <select class="select select-bordered bg-gray-light dark:bg-gray-dark w-full max-w-xs mb-3" name="genre" value="default">
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
                        <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mb-3 max-w-full" type="number" id="price" name="price" min="0" value="0">
                    {/if}

                    <div class="flex flex-col m-5">
                        <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3 w-full">앨범 등록하기</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>