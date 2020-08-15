import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Installation from '../views/Installation.vue'
import Config from '../views/Config.vue'
import Login from '../views/Login'

Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/installation',
    name: 'Installation',
    component: Installation,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
