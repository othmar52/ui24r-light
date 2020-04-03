import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
import RecmonitorSelector from '@/components/RecmonitorSelector.vue'
import Recmonitor from '@/components/Recmonitor.vue'

import MyAuxMixView from '@/views/MyAuxMixView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recmonitor',
    name: 'EmptyRouterView',
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'RecmonitorSelector',
        component: RecmonitorSelector
      },
      {
        path: ':socketId',
        name: 'RecmonitorShow',
        component: Recmonitor
      }
    ]
  },
  {
    path: '/mymix',
    name: 'MyAuxMixViewConfigurator',
    component: MyAuxMixView
  },
  {
    path: '/mymix/:myAuxMixConf',
    name: 'MyAuxMixViewShow',
    component: MyAuxMixView
  }
]

const router = new VueRouter({
  routes
})

export default router
