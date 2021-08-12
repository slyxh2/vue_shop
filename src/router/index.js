import Vue from 'vue'
import VueRouter from 'vue-router'

//import login from '../components/login.vue'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
//import home from '../components/home.vue'
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
//import welcome from '../components/welcome.vue'
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

//import users from '../components/user/user.vue'
const users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/user.vue')
//import rights from '../components/power/rights.vue'
const rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/rights.vue')
//import roles from '../components/power/roles.vue'
const roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/roles.vue')

//import categories from '../components/goods/categories.vue'
const categories = () => import(/* webpackChunkName: "cate_param" */ '../components/goods/categories.vue')
//import parameters from '../components/goods/parameters.vue'
const parameters = () => import(/* webpackChunkName: "cate_param" */ '../components/goods/parameters.vue')

//import list from '../components/goods/list.vue'
const list = () => import(/* webpackChunkName: "list_add" */ '../components/goods/list.vue')
//import add from '../components/goods/add.vue'
const add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/add.vue')

//import order from '../components/order/order.vue'
const order = () => import(/* webpackChunkName: "order_report" */ '../components/order/order.vue')
//import report from '../components/report/report.vue'
const report = () => import(/* webpackChunkName: "order_report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home, redirect: '/welcome', children:[{
    path: '/welcome', component: welcome
  }, {path: '/users', component: users}, {path: '/rights', component: rights},
{path: '/roles', component: roles}, {path: '/categories', component: categories},
{path: '/params', component: parameters}, {path: '/goods', component: list}, 
{path: '/goods/add', component: add}, {path: '/orders', component: order},
{path: '/reports', component: report}]}
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制权限

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()

  const tokenStr  = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
