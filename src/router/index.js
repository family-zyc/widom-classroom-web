import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/common'
  },

  {
    path: '/common',
    component: Layout,
    alwaysShow: true,
    redirect: '/common/classroom/apply',
    name: 'Common',
    meta: { title: '公共模块', icon: 'common' },
    children: [
      {
        path: 'classroom/apply',
        name: 'ClassroomApply',
        component: () => import('@/views/classroom/apply/index'),
        meta: { title: '教室申请', icon: 'apply' }
      },
      {
        path: 'classroom/state',
        name: 'ClassroomState',
        component: () => import('@/views/classroom/usestate/index'),
        meta: { title: '教室状况', icon: 'eye-open' }
      },
      {
        path: 'device/fault',
        name: 'DeviceFault',
        component: () => import('@/views/device/fault/index'),
        meta: { title: '设备报修', icon: 'device-repair' }
      },
      {
        path: 'device/control',
        name: 'DeviceControl',
        component: () => import('@/views/device/control/index'),
        meta: { title: '设备控制', icon: 'device-control' }
      },
    ]
  },


  

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: 'TeacherManagement',
    meta: { title: '教师管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'TeacherList',
        component: () => import('@/views/teacher/list/index'),
        meta: { title: '教师列表', icon: 'user-fill' }
      },
      {
        path: 'save/',
        name: 'TeacherAdd',
        component: () => import('@/views/teacher/save/index'),
        meta: { title: '教师添加', icon: 'user-plus-fill' }
      },
      {
        path: 'save/:id',
        name: 'TeacherUpdate',
        component: () => import('@/views/teacher/save/index'),
        meta: { title: '教师修改' },
        hidden: true
      }
    ]
  },

  {
    path: '/classroom',
    component: Layout,
    redirect: '/classroom/list',
    name: 'ClassroomManagement',
    meta: { title: '教室管理', icon: 'class-manage' },
    children: [
      {
        path: 'list',
        name: 'ClassroomList',
        component: () => import('@/views/classroom/list/index'),
        meta: { title: '教室列表', icon: 'table' }
      },
      {
        path: 'applyList',
        name: 'ClassroomApplyList',
        component: () => import('@/views/classroom/applylist/index'),
        meta: { title: '申请列表', icon: 'table' }
      },
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'DeviceManagement',
    meta: { title: '设备管理', icon: 'device-manage' },
    children: [
      {
        path: 'list',
        name: 'DeviceList',
        component: () => import('@/views/device/list/index'),
        meta: { title: '设备列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'DeviceAdd',
        component: () => import('@/views/device/add/index'),
        meta: { title: '设备登记', icon: 'form' }
      },
      {
        path: 'fault/list',
        name: 'DeviceFaultList',
        component: () => import('@/views/device/faultlist/index'),
        meta: { title: '报修列表', icon: 'table' }
      },
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
