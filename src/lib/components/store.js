import { writable } from 'svelte/store';

export const audioTrack = writable(null);

export const loginUsername = writable('');
export const isLogin = writable(false);
export const baseUrl = writable("http://localhost:8090");
//export const baseUrl = writable("https://yonguk.shop");