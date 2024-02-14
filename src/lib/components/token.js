import { isLogin } from "$components/store.js";
import {goto} from "$app/navigation";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function checkAccessToken() {
  const accessToken = getCookie('accessToken');

  if (accessToken) {
    // accessToken이 있을 경우, 로그인 상태로 간주
    isLogin.set(true);
  } else {
    // accessToken이 없을 경우, 로그아웃 상태로 간주
    isLogin.set(false);
  }
}

export function setTokenCookie(name, value, hours) {
  let expires = "";
  if (hours) {
    let date = new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; Secure";
}


