import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Versions from '../views/Versions.vue'
import Config from '../views/Config.vue'
import Login from '../views/Login'
import VersionConfig from '../views/VersionConfig'
import Download from '../views/Download'

Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/versions',
    name: 'Versions',
    component: Versions,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: (route) => ({
      ...route.query,
      canEditType: route.query.canEditType !== 'false'
    })
  },
  {
    path: '/versions/config',
    name: 'VersionConfig',
    component: VersionConfig,
    props: (route) => ({
      ...route.query
    })
  },
  {
    path: '/download',
    name: 'Download',
    component: Download
  }
]

const router = new VueRouter({
  routes
})

export default router
