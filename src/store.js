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
      zeroDbPos: .7647058823529421,
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
      console.log("lost socket connection. store.js SOCKET_ONCLOSE()")
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
      Vue.set(state.mData, payload.key, payload.data)
    }
  },
  getters: {
    getCurSetup: state => {
      return state.cursetup;
    },
    readRemoteMixerValue: (state) => (keyArg) => {
      return state.mData[keyArg]
    },
    isSocketConnected: state => {
      return state.socket.isConnected
    },
  },
  actions: {
    sendMessage: function(context, message) {
      if(this.state.socket.isConnected === false) {
        console.log(`socket is NOT connected! will not send ${message}`)
        return
      }
      //console.log(`store.sendMessage(${message})`)
      Vue.prototype.$socket.send(message)
    },
    sendMixerParam: function(context, data) {
      this.dispatch(
        'sendMessage',
        `3:::SET${('string' == typeof data.mValue ? 'S' : 'D')}^${data.mKey}^${data.mValue}`
      )
    },
    sendMixerCommand: function(context, command) {
      this.dispatch(
        'sendMessage',
        `3:::${command}`
      )
    }

  }
})