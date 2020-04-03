import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
import RecmonitorSelector from '@/components/RecmonitorSelector.vue'
import Recmonitor from '@/components/Recmonitor.vue'
import MyAuxMixConfigurator from '@/components/MyAuxMixConfigurator.vue'
import MyAuxMix from '@/components/MyAuxMix.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recmonitor',
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
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'MyAuxMixConfigurator',
        component: MyAuxMixConfigurator
      },
      {
        path: ':socketId/:myInputChannels/:myAuxChannel',
        name: 'MyAuxMixShow',
        component: MyAuxMix
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
