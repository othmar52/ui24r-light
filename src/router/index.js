import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RecmonitorView from '../views/RecmonitorView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recmonitor',
    name: 'RecmonitorSelector',
    // component: () => import('../views/RecmonitorView.vue')
    component: RecmonitorView
  },
  {
    path: '/recmonitor/:socketId',
    name: 'RecmonitorShow',
    // component: () => import('../views/RecmonitorView.vue')
    component: RecmonitorView
  }
]

const router = new VueRouter({
  routes
})

export default router
