import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import PrettyInput from 'pretty-checkbox-vue/input'
import PrettyCheck from 'pretty-checkbox-vue/check'
import PrettyRadio from 'pretty-checkbox-vue/radio'

import VuePapaParse from 'vue-papa-parse'
Vue.use(VuePapaParse)
Vue.config.productionTip = false

// Vue.component('p-input', PrettyInput)
Vue.component('p-check', PrettyCheck)
Vue.component('p-radio', PrettyRadio)

// due to the requirement of supporting file:// protocol we can't
// perform an ajax call. but we can load a script during runtime by creating a DOM node...
const configJsNode = document.createElement('script')
configJsNode.setAttribute('src', './config.js?v=4')
document.head.appendChild(configJsNode)

// helper vars
let loadAttempts = 0
let initApp = false

window.initialDataLoadInterval = window.setInterval(
  function () {
    // continue loop until we reach max tries or we get mixerConfig from external file...
    if (loadAttempts > 10 || typeof mixerConfig !== 'undefined') {
      initApp = true
    }
    loadAttempts++
    if (initApp === false) {
      return
    }

    // destroy the interval and init Vue app
    clearInterval(window.initialDataLoadInterval)
    window.initialDataLoadInterval = undefined
    configJsNode.parentNode.removeChild(configJsNode)

    try {
      // pass loaded mixerConfig (or undefined) to the store
      store.commit('retrieveMixerConfig', mixerConfig) // eslint-disable-line no-undef
    } catch (e) {
      // don't wory about missing config as app will handle missing config
    }

    // init App
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  },
  100
)
