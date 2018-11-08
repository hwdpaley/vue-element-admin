// import Cookies from 'js-cookie'

const TokenKey = 'feathers-jwt'

export function getToken() {
  return localStorage.getItem(TokenKey);
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  // localStorage.token = token;
  return localStorage.setItem(TokenKey, token);
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // localStorage.token='';
  return localStorage.removeItem(TokenKey);
  // return Cookies.remove(TokenKey)
}
