<script>
    import {onMount} from "svelte";
    import {page} from '$app/stores';
    import {getCookie} from '$components/token.js';
    import {goto} from "$app/navigation";
    import {toastNotice} from "$components/toastr.js";
    import Time, {dayjs} from "svelte-time";
    import {baseUrl} from "$components/store.js";
    import {DateInput} from "date-picker-svelte";

    const username = $page.params['username'];
    let date = new Date();
    $: donation_response = [{
        "patronUsername": "",
        "artistUsername": "",
        "amount": 0,
        "message": "",
        "time": ""
    },]
    $: donation_response_art = [{
        "patronUsername": "",
        "artistUsername": "",
        "amount": 0,
        "message": "",
        "time": ""
    },]
    $: donation_regular_response = [{
        "patronUsername": "",
        "artistUsername": "",
        "executeDay": 1,
        "amount": 0,
        "anonymous": false
    },]
    $: donation_update = {
        "patronName": username,
        "artistName": "",
        "executeDay": 1,
    };
    $: donation_update_check = [];

    onMount(async () => {
        const access_token = getCookie("accessToken");
        let response = await fetch($baseUrl + `/donation/list/patron/${username}`, {
            credentials: 'include',
            headers: {
                Authorization: `${access_token}`
            }
        }).then((res) => res.json());
        if (response.code != null) {
            response_alert(response.code);
        } else {
            response_alert(response.statusCode);
        }
        donation_response = response.data;
    });

    onMount(async () => {
        const access_token = getCookie("accessToken");
        let response = await fetch($baseUrl + `/donation/list/artist/${username}`, {
            credentials: 'include',
            headers: {
                Authorization: `${access_token}`
            }
        }).then((res) => res.json());
        if (response.code != null) {
            response_alert(response.code);
        } else {
            response_alert(response.statusCode);
        }
        donation_response_art = response.data;
    });

    onMount(async () => {
        const access_token = getCookie("accessToken");
        let response = await fetch($baseUrl + `/donation/list/patron/${username}/regular`, {
            credentials: 'include',
            headers: {
                Authorization: `${access_token}`
            }
        }).then((res) => res.json());
        if (response.code != null) {
            response_alert(response.code);
        } else {
            response_alert(response.statusCode);
        }
        donation_regular_response = response.data;
        var i = 0;
        for(i = 0; i < donation_regular_response.length; i++){
            donation_update_check.push(false)
        }
    });

    function donation_regular_update(i) {
        if (donation_update_check[i] == false) {
            donation_update_check[i] = true;
        } else {
            donation_update_check[i] = false;
        }
        // const url = `/member/${username}/donation/list`
        // goto('/').then(
        //     () => goto(url)
        // );
    }

    async function donation_regular_update_request(donation){
        donation_update.artistName = donation.artistUsername;
        donation_update.executeDay = date.getDate();
        console.log(date);
        const access_token = getCookie("accessToken");
        let response = await fetch($baseUrl + `/donation/regular`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${access_token}`
            },
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify(donation_update),
        }).then((res) => res.json());
        toastNotice(response.data);
        const url = window.location.pathname;
        goto('/').then(
            () => goto(url)
        );
    }

    async function donation_regular_delete(artistName, executeDay) {
        donation_update.artistName = artistName;
        donation_update.executeDay = executeDay;
        const access_token = getCookie("accessToken");
        let response = await fetch($baseUrl + `/donation/regular`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${access_token}`
            },
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify(donation_update),
        }).then((res) => res.json());
        toastNotice(response.data);
        const url = window.location.pathname;
        goto('/').then(
            () => goto(url)
        );
    }

    function response_alert(resultCode) {
        if (resultCode == 401) {
            toastNotice("로그인이 필요합니다.");
        } else if (resultCode == 400) {
            toastNotice("권한이 없습니다.");
        } else if (resultCode == 501) {
            toastNotice("내역이 존재하지 않습니다.");
        }
    }

</script>

<div class="my-4 space-y-4">
    <div class="grid grid-cols-3">
        <div class="p-4">
            <h1 class="text-left p-4">후원 목록</h1>
            {#if donation_response == null}
                <div class="text-left p-4">후원 목록이 없습니다.</div>
            {:else }
                {#each donation_response as donation}
                    <div class="card card-side dark:input-primary bg-gray-light dark:bg-gray-dark shadow-xl m-5">
                        <div class="avatar placeholder w-1/5 h-12 place-self-center justify-center pb-0.5 pt-0.5">
                            <div class="bg-neutral text-neutral-content rounded-full w-11">
                                <span>{donation.patronUsername}</span>
                            </div>
                        </div>
                        <div class="card-body w-4/5 p-3">
                            <h2 class="card-title">{donation.message}</h2>
                            <p>{donation.amount}원</p>
                            <div class="card-actions justify-end">
                                To. {donation.artistUsername}
                                <div class="badge badge-outline ">
                                    <Time timestamp="{donation.time}" format="MMM DD YYYY, HH:mm"></Time>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="p-4">
            <h1 class="text-left p-4">후원 받은 목록</h1>
            {#if donation_response_art == null}
                <div class="text-left p-4">후원 받은 목록이 없습니다.</div>
            {:else }
                {#each donation_response_art as donation}
                    <div class="card card-side dark:input-primary bg-gray-light dark:bg-gray-dark shadow-xl m-5">
                        <div class="avatar placeholder w-1/5 h-12 place-self-center justify-center pb-0.5 pt-0.5">
                            <div class="bg-neutral text-neutral-content rounded-full w-11">
                                <span>{donation.patronUsername}</span>
                            </div>
                        </div>
                        <div class="card-body w-4/5 p-3">
                            <h2 class="card-title">{donation.message}</h2>
                            <p>{donation.amount}원</p>
                            <div class="card-actions justify-end">
                                From. {donation.patronUsername}
                                <div class="badge badge-outline ">
                                    <Time timestamp="{donation.time}" format="MMM DD YYYY, HH:mm"></Time>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="p-4">
            <h1 class="text-left p-4">정기 후원 목록</h1>
            {#if donation_regular_response == null}
                <div class="text-left p-4">후원 목록이 없습니다.</div>
            {:else }
                {#each donation_regular_response as donation, index}
                    <div class="card card-side dark:input-primary bg-gray-light dark:bg-gray-dark shadow-xl m-5">
                        <div class="card-body place-self-center">
                            <ul class="steps">
                                <li data-content="" class="step step-neutral">Me</li>
                                <li data-content="➡" class="step step-neutral">{donation.amount}원</li>
                                <li data-content="" class="step step-neutral">{donation.artistUsername}</li>
                            </ul>
                            <div class="grid grid-cols-2">
                                <div class="text-left text-2xl">매월 {donation.executeDay}일</div>
                                <div class="grid grid-cols-2">
                                    <button class="btn" on:click={(event)=>{donation_regular_update(index)}}>후원일 수정</button>
                                    <button class="btn"
                                            on:click={(event)=>{donation_regular_delete(donation.artistUsername, donation.executeDay)}}>
                                        후원 취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {#if donation_update_check[index]}
                        <div class="card card-side dark:input-primary bg-gray-light dark:bg-gray-dark shadow-xl m-5">
                            <div class="grid grid-cols-2">
                                <div class="card-body">
                                    <DateInput format="yy/MM/dd" placeholder="년/월/일 (6자리)" dynamicPositioning
                                               bind:value={date}/>
                                </div>
                                <button class="btn place-self-center" on:click={(event)=>{donation_regular_update_request(donation)}}>
                                    수정
                                </button>
                            </div>
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
</div>
