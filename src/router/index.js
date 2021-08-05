import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/user.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import categories from '../components/goods/categories.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home, redirect: '/welcome', children:[{
    path: '/welcome', component: welcome
  }, {path: '/users', component: users}, {path: '/rights', component: rights},
{path: '/roles', component: roles}, {path: '/categories', component: categories}]}

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
