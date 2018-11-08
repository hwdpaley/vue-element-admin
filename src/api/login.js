import request from '@/utils/request'
import decode from 'jwt-decode'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/authenticate',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  // Retrieve the token from wherever you've stored it.
  // const jwt = window.localStorage.getItem('feathers-jwt')
  const payload = decode(token)
  payload.user.roles = ['admin'];
  return Promise.resolve(payload.user);
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
}

