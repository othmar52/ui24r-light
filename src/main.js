import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueQrcode from '@chenfengyuan/vue-qrcode'

Vue.config.productionTip = false

Vue.component(VueQrcode.name, VueQrcode)
Vue.use({
  install (Vue, options) {
    Object.defineProperty(Vue.prototype, '$mixer1Socket', {
      get () {
        return store.getters.mixer1Socket
      },
      set (v) {
        return store.commit('mixer1Socket', v)
      }
    })
    Object.defineProperty(Vue.prototype, '$mixer2Socket', {
      get () {
        return store.getters.mixer2Socket
      },
      set (v) {
        return store.commit('mixer2Socket', v)
      }
    })
  }
})

// due to the requirement of supporting file:// protocol we can't
// perform an ajax call. but we can load a script during runtime by creating a DOM node...
const configJsNode = document.createElement('script')
configJsNode.setAttribute('src', './config.js')
document.head.appendChild(configJsNode)
let loadAttempts = 0

window.initialDataLoadInterval = window.setInterval(
  function () {
    if (loadAttempts > 3) {
      clearInterval(window.initialDataLoadInterval)
      configJsNode.parentNode.removeChild(configJsNode)
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
    }
    if (typeof mixerConfig === 'undefined') {
      // continue loop until we get mixerConfig from external file...
      loadAttempts++
      return
    }
    // now we ar ready to go
    // destroy the interval and init Vue app
    clearInterval(window.initialDataLoadInterval)
    window.initialDataLoadInterval = undefined
    configJsNode.parentNode.removeChild(configJsNode)

    store.commit('retrieveMixerConfig', mixerConfig) // eslint-disable-line no-undef

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  },
  5
)
