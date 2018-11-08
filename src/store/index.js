import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import feathersVuex from './feathers/feathersVuex';
import localAuth from './feathers/localAuth';

const {
  service,
  auth,
  FeathersVuex
} = feathersVuex;

Vue.use(Vuex)
Vue.use(FeathersVuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    localAuth
  },
  getters,
  plugins: [
    service('users', {
      instanceDefaults: {
        username: '',
        password: '',
        displayName: '',
        imageUrl: '',
        phone: '',
        groupId: ''
      }
    }),
    service('groups', {
      instanceDefaults: {
        groupName: '',
        pId: null,
        status: '',
        imageUrl: '',
        address: '',
        phone: '',
        validDate: '',
        mchId: '',
        gzhName: '',
        appId: '',
        appSecret: ''
      }
    }),
    service('menus', {
      instanceDefaults: {
        name: '',
        groupId: null,
        pId: null,
        route: ''
      }
    }),
    service('roles', {
      instanceDefaults: {
        name: '',
        groupId: null,
        desc: ''
      }
    }),
    service('customers', {
      instanceDefaults: {
        name: '',
        groupId: null,
        nickname: '',
        status: '',
        score: '',
        amount: '',
        phone: ''
      }
    }),
    service('lunbotus', {
      instanceDefaults: {
        groupId: '',
        imageUrl: ''
      }
    }),
    service('boards', {
      instanceDefaults: {
        name: '',
        background: ''
      }
    }),
    service('lists', {
      instanceDefaults: {
        name: '',
        order: 0,
        boardId: '',
        archived: false
      }
    }),
    service('cards', {
      instanceDefaults: {
        title: '',
        description: '',
        order: 0,
        archived: false,
        listId: '',
        boardId: '',
        members: []
      }
    }),

    service('activities', {
      instanceDefaults: {
        text: '',
        boardId: '',
        userId: null,
        user: 'User'
      }
    }),
    auth({
      userService: 'users'
    })
  ]
})

export default store
