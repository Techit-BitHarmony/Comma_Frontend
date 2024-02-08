<script>
    import {baseUrl} from "$components/store.js";
    import {toastWarning} from "$components/toastr.js";
    import {goto} from "$app/navigation";
    import {setTokenCookie, checkAccessToken} from "$components/token.js";
    async function releaseFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        checkAccessToken();
        await goto("/");
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
                    <label for="albumCover" class="form-label">앨범 이미지</label>
                    <span class="block w-64 h-64 relative">
                        <img class="w-full h-full object-cover" src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg" alt="Album Cover" />
                        <input class="mt-2" type="file" id="musicImageFile" name="musicImageFile">
                    </span>
                </div>

                <!-- Right Section -->
                <div class="flex flex-col m-5 w-1/2">
                    <label for="albumname" class="form-label mt-2">제목</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full" name="albumname" id="albumname" placeholder="제목을 입력해주세요.">

                    <label>Genre</label>
                    <select name="genre">
                        <option value="rock">Rock</option>
                        <option value="pop">Pop</option>
                        <option value="jazz">Jazz</option>
                        <option value="classical">Classical</option>
                        <!-- Add more options as needed -->
                    </select> <br>

                    <input type="hidden" name="license" value="false">
                    <label>License</label>
                    <input type="checkbox" id="license" name="license" value="false"> <br>

                    <input type="hidden" name="permit" value="false">
                    <label>Permit</label>
                    <input type="checkbox" id="permit" name="permit" value="false"> <br>

                    <label id="licenseDescriptionLabel">License Description</label>
                    <textarea id="licenseDescription" name="licenseDescription"></textarea> <br>

                    <input type="hidden" name="price" value="0">
                    <label id="priceLabel">Price</label>
                    <input type="number" id="price" name="price" min="0"> <br>

                    <div class="flex flex-col m-5">
                        <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3 w-full">앨범 등록하기</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>