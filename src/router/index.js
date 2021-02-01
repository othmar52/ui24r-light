import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
import RecmonitorSelector from '@/components/Recmonitor/Selector.vue'
import Recmonitor from '@/components/Recmonitor/Show.vue'
import MatrixMixerConfigurator from '@/components/MatrixMixer/Configurator.vue'
import MatrixMixerShow from '@/components/MatrixMixer/Show.vue'
import CustomFadersConfigurator from '@/components/CustomFaders/Configurator.vue'

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
    path: '/matrixmix',
    component: EmptyRouterView,
    children: [
      {
        path: 'config',
        name: 'MatrixMixerConfigurator',
        component: MatrixMixerConfigurator
      },
      {
        path: 'show',
        name: 'MatrixMixerShow',
        component: MatrixMixerShow
      }
    ]
  },
  {
    path: '/custom',
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'CustomFadersConfigurator',
        component: CustomFadersConfigurator
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
