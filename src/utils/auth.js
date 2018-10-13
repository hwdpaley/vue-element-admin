import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // localStorage.token = token;
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // localStorage.token='';
  return Cookies.remove(TokenKey)
}
