import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
import RecmonitorSelector from '@/components/Recmonitor/Selector.vue'
import Recmonitor from '@/components/Recmonitor/Show.vue'
import MatrixMixerConfigurator from '@/components/MatrixMixer/Configurator.vue'
import MatrixMixerShow from '@/components/MatrixMixer/Show.vue'
import CustomFadersConfigurator from '@/components/CustomFaders/Configurator.vue'
import DeviceList from '@/components/CcTables/DeviceList.vue'
import CcTablesShow from '@/components/CcTables/Show.vue'
import PatchListShow from '@/components/PatchList/Show.vue'
import PatchSetList from '@/components/PatchList/PatchSetList.vue'
import User1Show from '@/components/User1/Show.vue'

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
    path: '/cctables',
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'DeviceList',
        component: DeviceList
      },
      {
        path: 'cctable/:deviceId',
        name: 'CcTablesShow',
        component: CcTablesShow
      }
    ]
  },
  {
    path: '/patchlist',
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'PatchSetList',
        component: PatchSetList
      },
      {
        path: 'patches/:deviceId',
        name: 'PatchListShow',
        component: PatchListShow
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
  },
  {
    path: '/user1',
    name: 'User1Show',
    component: User1Show
  }
]

const router = new VueRouter({
  routes
})

export default router
