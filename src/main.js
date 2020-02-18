import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false

Vue.use(
  VueNativeSock,
  'ws://localhost',
  {
    store: store,
    connectManually: true,
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
  }
)


const vm = new Vue({
  render: h => h(App),
  store: store,
  created(){ console.log(this.$parser)}
}).$mount('#app')

//vm.$connect()


// https://github.com/nathantsoi/vue-native-websocket
// https://github.com/probil/vue-socket.io-extended
// https://sombriks.com.br/#/blog/0013-real-time-communications-with-socketio.md
