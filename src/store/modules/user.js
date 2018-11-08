import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import service from "../feathers/feathers-client";

const user = {
  // namespaced: true,
  state: {
    user: null,
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    groupsin: [],
    allgroups: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user
      state.roles = user.roles
      // console.log('SET_USER', state.user);
    },
    SET_GROUP: (state, group) => {
      state.groupsin = group.groupsin
      state.allgroups = group.allgroups
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          if (!data) {
            console.log('reject', '非法用户名或密码')
            reject(new Error('非法用户名或密码'))
            // throw new Error('非法用户名或密码')
          } else {
            console.log('response', response)
            commit('SET_TOKEN', data.token)
            setToken(response.data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(data => {
          // if (!data.data) { // 由于mockjs 不支持自定义状态码只能这样hack
          //   reject('error')
          // }
          // const data = response

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.displayName)
          commit('SET_AVATAR', data.imageUrl)
          commit('SET_INTRODUCTION', data.phone)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.displayName)
          commit('SET_AVATAR', data.imageUrl)
          commit('SET_INTRODUCTION', data.displayName)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    },
    setuserToken({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setNewGroups({ commit }, group) {
      commit('SET_GROUP', {
        groupsin: group.groupsin,
        allgroups: group.allgroups
      });
    },
    setGroups({ commit }, groupId) {
      const allgroups = [];
      const groupsin = [];
      const gid = groupId;
      service.service('groups').find({ query: { _id: gid }}).then(myg => {
        allgroups.push({
          _id: myg.data[0]._id,
          name: myg.data[0].groupName
        });
        groupsin.push(myg.data[0]._id);
        service.service('groups').find({ query: { pId: gid }})
          .then(gs => {
            // this.allupgroups.push({ _id: "1234567890", name: "顶级" });
            gs.data.forEach(item => {
              allgroups.push({ _id: item._id, name: item.groupName });
              groupsin.push(item._id);
              service.service('groups').find({ query: { pId: item._id }}).then(g2 => {
                g2.data.forEach(item2 => {
                  allgroups.push({
                    _id: item2._id,
                    name: item2.groupName
                  });
                  groupsin.push(item2._id);
                });
              });
            });
            console.log("groupsin", groupsin);
            console.log("allgroups", allgroups);
            commit('SET_GROUP', {
              groupsin: groupsin,
              allgroups: allgroups
            });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      });
    }
  }
}

export default user
