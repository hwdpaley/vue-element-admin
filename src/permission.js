import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

function isLoggedIn(to, from, next) {
  store.dispatch('auth/authenticate').then(() => {
    console.log('isLoggedIn');
    next();
  }).catch(() => {
    next('/login');
  });
}
// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  const token = getToken();
  if (token) { // determine if there has token
    // console.log('permission', token);
    /* has token*/
    if (to.path === '/login') {
      console.log('to.path', to.path);
      next({ path: '/shouye' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      console.log('to.path', to.path);
      if (store.getters.roles && store.getters.roles.length !== 0 && store.getters.addRouters.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // const user = store.dispatch('auth/authenticate').then((r) => {
        //   console.log('permission', r);
        // });
        // console.log('length === 0', store.getters.roles);
        const roles = store.getters.user.roles;
        store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表

          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          // console.log('GenerateRoutes', store.getters.addRouters);

          // console.log('length === 0 ?', store.getters.roles.length);
          // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
        isLoggedIn(to, from, next);
        // store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        //   console.log('userinfo', res);
        //   const roles = res.roles // note: roles must be a array! such as: ['editor','develop']

        // }).catch((err) => {
        //   console.log('GetUserInfo err', err.Message);
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error(err || 'Verification failed, please login again')
        //     next({ path: '/login' })
        //   })
        // })
      } else {
        console.log('store.getters.roles === null ');
        store.dispatch('auth/authenticate').then(() => {
          store.dispatch('localAuth/loginbytoken', { token }).then((user) => {
            // console.log('refash', user);
            store.dispatch("setUser", user);
            const roles = store.getters.user.roles;
            console.log('roles', roles);

            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            })
            store.dispatch('setGroups', store.getters.user.groupId)
            next();
          })
        })

        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next();
        // } else {
        //   next({ 'path': '/401', 'replace': true, 'query': { 'noGoBack': true } });
        // }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
