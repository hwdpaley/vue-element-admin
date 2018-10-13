import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

export function logout(token) {
  return request({
    url: '/auth/logout',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

