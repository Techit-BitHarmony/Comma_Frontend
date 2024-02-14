<script>
    import {onMount} from "svelte";
    import {page} from '$app/stores';
    import {getCookie} from '$components/token.js';
    import {goto} from "$app/navigation";
    import {baseUrl} from "$components/store.js";
    import {toastNotice} from "$components/toastr.js";
    import {DateInput} from 'date-picker-svelte'

    let username = $page.params['username'];
    onMount(async () => {
        const access_token = getCookie("accessToken");
        if (access_token == null) {
            // goto('/');
        }
    })

    let donation_request = {
        patronName: username,
        artistName: "",
        amount: 0,
        message: "",
        anonymous: false
    };

    let date = new Date();
    let donation_regular_request = {
        patronName: username,
        artistName: "",
        amount: 0,
        executeDay: date.getDate(),
        anonymous: false
    };

    let is_regular = false;

    async function handleSubmit() {
        const access_token = getCookie("accessToken");
        if (is_regular == true) {
            donation_regular_request.artistName = donation_request.artistName;
            donation_regular_request.amount = donation_request.amount;
            donation_regular_request.anonymous = donation_request.anonymous;
            donation_regular_request.executeDay = date.getDate();

            let response = await fetch($baseUrl + `/donation/regular`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${access_token}`
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(donation_regular_request),
            }).then((res) => res.json());
            toastNotice(response.data);
        } else {
            let response = await fetch($baseUrl + `/donation/once`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${access_token}`
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(donation_request),
            }).then((res) => res.json());
            toastNotice(response.data);
        }
    }

    function check_input_data() {
        if (donation_request.artistName == null) {

        }
        if (donation_request.amount <= 0) {

        }
    }

    function add_amount() {
        donation_request.amount += 1000;
    }

    function sub_amount() {
        if (donation_request.amount >= 1000) {
            donation_request.amount -= 1000;
        }
    }

    function check_amount() {
        if (donation_request.amount < 0) {
            donation_request.amount = 0;
        }
        if (donation_request.amount % 1000 != 0) {
            donation_request.amount = Math.round(donation_request.amount / 1000) * 1000;
        }

        return true;
    }
</script>

<div class="container my-4 space-y-4">
    <div class="pl-10 pr-10">
        <div class="flex flex-col">
            <h2 class="text-3xl font-bold border-bottom py-2 m-5 text-left dark:text-primary">아티스트에게 후원하기</h2>
            <form>
                <div class="flex flex-col m-5">
                    <label for="text" class="form-label">후원자 명</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
                           name="username" id="username" type="text" placeholder={username} disabled
                           bind:value={donation_request.patronName}/>
                    <label class="cursor-pointer label">
                        <span class="label-text">익명 설정</span>
                        <input type="checkbox" class="checkbox checkbox-success"
                               bind:checked={donation_request.anonymous}/>
                    </label>
                </div>
                <div class="flex flex-col m-5">
                    <label for="text" class="form-label">아티스트 명</label>
                    <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
                           type="text" placeholder="후원 받을 아티스트의 아이디를 입력해주세요." bind:value={donation_request.artistName}/>
                </div>
                <div class="flex flex-col m-5">
                    <label for="text" class="form-label">금액</label>
                    <span>
                        <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-md"
                               type="number" placeholder="후원하고자 하는 금액을 입력해주세요." bind:value={donation_request.amount}>
                        <button class="btn btn-circle" on:click={(event) => {add_amount(); check_amount();}}>+</button>
                        <button class="btn btn-circle" on:click={(event) => {sub_amount(); check_amount();}}>-</button>
                    </span>
                </div>

                <div class="flex flex-col m-5">
                    <label class="cursor-pointer label">
                        <label for="text" class="form-label">정기 후원</label>
                        <input type="checkbox" class="checkbox checkbox-success" bind:checked={is_regular}/>
                    </label>
                </div>

                {#if is_regular}
                    <div class="flex flex-col m-5">
                        <label for="text" class="form-label"> 정기 후원일</label>
                        <DateInput format="yy/MM/dd" placeholder="년/월/일 (6자리)" dynamicPositioning bind:value={date}/>
                    </div>
                {:else }
                    <div class="flex flex-col m-5">
                        <label for="text" class="form-label">응원 메세지</label>
                        <input class="input input-bordered dark:input-primary bg-gray-light dark:bg-gray-dark mt-3 max-w-full"
                               type="text" placeholder="응원 메세지를 남겨보세요." bind:value={donation_request.message}/>
                    </div>
                {/if}
                <div class="flex flex-col m-5">
                    <button type="submit" class="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3"
                            on:click={(event)=> handleSubmit()}>등록
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
