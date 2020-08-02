import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Installation from '../views/Installation.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
