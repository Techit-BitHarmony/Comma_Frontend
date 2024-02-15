import { writable } from 'svelte/store';

export const audioTrack = writable(null);

export const loginUsername = writable('프로필');
export const loginMemberId = writable('0');
export const isLogin = writable(false);
export const baseUrl = writable("http://localhost:8090");
//export const baseUrl = writable("https://yonguk.shop");