// import { setToken } from '@/utils/auth';
// import router from '../../router';
// const mutations = {
//   SET_CODE: (state, code) => {
//     state.code = code
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   }
// }
// const feathers = require('@feathersjs/feathers');
// const rest = require('@feathersjs/rest-client');
// const auth = require('@feathersjs/authentication-client');

// const superagent = require('superagent');
// const localStorage = require('localstorage-memory');

import feathersClient from './feathers-client';
const actions = {
  login({ dispatch }, { user }) {
    // if (valid) {
    return new Promise((resolve, reject) => {
      feathersClient.authenticate({
        strategy: 'local',
        ...user
      }, { root: true }).then(response => {
        // console.log('Authenticated!', response);
        return feathersClient.passport.verifyJWT(response.accessToken);
      })
        .then(payload => {
          // console.log('JWT Payload', payload);
          return feathersClient.service('users').get(payload.userId);
        })
        .then(user => {
          console.log('login', user);
          resolve(user);
          // feathersClient.set('user', user);
          // console.log('User', feathersClient.get('user'));
        })
        .catch(function (error) {
          console.error('Error authenticating!', error);
          console.log('reject', '非法用户名或密码');
          reject(new Error('非法用户名或密码'));
        });
    })
  },
  loginbytoken({ dispatch }, { token }) {
    return new Promise((resolve, reject) => {
      feathersClient.passport.verifyJWT(token).then(payload => {
        // console.log('JWT Payload', payload);
        return feathersClient.service('users').get(payload.userId);
      })
        .then(user => {
          // console.log('loginbytoken', user);
          resolve(user);
        })
        .catch(function (error) {
          console.error('Error authenticating!', error);
          console.log('reject', '非法用户名或密码');
          reject(new Error('非法用户名或密码'));
        });
    });
  },
  // LoginByUsername({ commit }, userInfo) {
  //   const username = userInfo.username.trim()
  //   return new Promise((resolve, reject) => {
  //     loginByUsername(username, userInfo.password).then(response => {
  //       const data = response.data
  //       if (!data) {
  //         console.log('reject', '非法用户名或密码')
  //         reject(new Error('非法用户名或密码'))
  //         // throw new Error('非法用户名或密码')
  //       } else {
  //         console.log('response', response)
  //         commit('SET_TOKEN', data.token)
  //         setToken(response.data.token)
  //         resolve()
  //       }
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  async logout({ dispatch }) {
    console.log('logout....');
    feathersClient.logout().then((u) => {
      console.log('logout....', u);
    });
  }
};

export default {
  namespaced: true,
  actions
  // mutations
};
