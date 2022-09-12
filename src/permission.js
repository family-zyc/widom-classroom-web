import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      const role = store.getters.role
      if (hasGetUserInfo) {
        // Todo:path filter
        let isPermit = true
        if(role == 1){ // 普通用户
          let reg= /^\/common.*?$/
          if(!reg.test(to.path)){
            Message.error('权限不够')
            console.log("from" + from.path)
            console.log("to" + to.path)
            isPermit = false
          }
        }
        if(isPermit){
          next()
        }
        
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          
          next({ path: '/' })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }



})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
