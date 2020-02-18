import Vue from 'vue'
import Vuex from 'vuex'
import ParserPlugin from './assets/js/ParserPlugin'
 
Vue.use(Vuex);
 
export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
    mData: {

    },
    cursetup: {
      input: 24,
      linein: 2,
      fx: 4,
      aux: 10,
      sub: 6,
      rec: true,
      // TODO: below variables can be removed, right?
      bankSize: 8,
      maxx: false,
      phantom: 20,
      uniqueid: '8100C00220460094148085785103303C'
    }
  },
  plugins: [
    ParserPlugin
  ],
  mutations:{
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event)  {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
      //this.$parser.parseCommand(message)
      //console.log(state.socket.message);
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
    updateMixerData(state, payload) {
      //console.log('payload', payload)
      state.mData[payload.key] = payload.data
    }
  },
  getters: {
    getCurSetup: state => {
      return state.cursetup;
    },
    getMixerValue: (state) => (keyArg) => {
      console.log("getMixerValue", keyArg)
      console.log("state", state)
      console.log("state.mData", state.mData)
      console.log("state.mData[key]", state.mData[keyArg])
      return state.mData[keyArg]
    }
  },
  actions: {
    sendMessage: function(context, message) {
      Vue.prototype.$socket.send(message)
    }

  }
})