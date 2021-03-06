import Vue from 'vue'
import Vuex from 'vuex'
import MixerConfigValidator from '../assets/js/MixerConfigValidator'
import Ui24rMessageParser from '../assets/js/Ui24rMessageParser'

Vue.use(Vuex)

// thanks to https://stackoverflow.com/questions/58879395/handle-multiple-sockets-in-a-vue-project
// todo: implement ping/pong as lost connection does not fire onError or onClose events...
//   https://stackoverflow.com/questions/26971026/handling-connection-loss-with-websockets
export default new Vuex.Store({
  state: {
    haveValidConfig: false,
    reconnectInterval: undefined,
    sockets: {
      mixer1: {
        isConnected: false,
        message: '',
        reconnectError: false,
        socket: undefined,
        config: {},
        keepAliveInterval: undefined,
        mData: {}
      },
      mixer2: {
        isConnected: false,
        message: '',
        reconnectError: false,
        socket: undefined,
        config: {},
        keepAliveInterval: undefined,
        mData: {}
      },
      paramRecorder1: {
        isConnected: false,
        message: '',
        reconnectError: false,
        socket: undefined,
        config: {},
        keepAliveInterval: undefined,
        mData: {}
      },
      paramRecorder2: {
        isConnected: false,
        message: '',
        reconnectError: false,
        socket: undefined,
        config: {},
        keepAliveInterval: undefined,
        mData: {}
      }
    }
  },
  plugins: [
    MixerConfigValidator,
    Ui24rMessageParser
  ],
  mutations: {
    retrieveMixerConfig: function () {
      // @see src/assets/js/MixerConfigValidator.js
    },
    receiveSocketMessage: function (state, data) {
      state.sockets[data.socketId].message = data.message
    },
    updateMixerData (state, payload) {
      Vue.set(state.sockets[payload.socketId].mData, payload.key, payload.data)
    }
  },
  actions: {
    setValidatedMixerConfig: function (context, mixerConfig) {
      //  console.log('setMixerConfig ', mixerConfig)
      context.state.haveValidConfig = true
      context.state.sockets.mixer1.config = mixerConfig.mixer1
      context.state.sockets.mixer2.config = mixerConfig.mixer2
      context.state.sockets.paramRecorder1.config = mixerConfig.paramRecorder1
      context.state.sockets.paramRecorder2.config = mixerConfig.paramRecorder2
    },
    connectAllEnabledSockets: function (context) {
      for (const [key, value] of Object.entries(context.state.sockets)) {
        if (value.config.enabled === false) {
          continue
        }
        if (context.state.sockets[key].isConnected === true) {
          continue
        }
        if (typeof value.config.url === 'undefined') {
          continue
        }
        if (typeof context.state.sockets[key].socket !== 'undefined') {
          if (context.state.sockets[key].socket.readyState === 0) {
            context.state.sockets[key].isConnected = false
            // still in connecting state
            continue
          }
        }

        // console.log('connecting to ', value.config.url)
        const sock = new WebSocket(
          value.config.url
        )
        sock.onopen = (event) => {
          // console.log('onOpen() ', event)
          context.state.sockets[key].isConnected = true
          if (typeof context.state.sockets[key].keepAliveInterval === 'undefined') {
            context.state.sockets[key].keepAliveInterval = setInterval(() => {
              context.dispatch('sendMixerCommand', { socketId: key, cmd: 'ALIVE' })
            }, 1000)
          }
        }
        sock.onclose = (event) => {
          // console.log('onClose() ', event)
          context.state.sockets[key].isConnected = false
          clearInterval(context.state.sockets[key].keepAliveInterval)
          context.state.sockets[key].keepAliveInterval = undefined
          context.state.sockets[key].socket = undefined
        }
        sock.onerror = (event) => {
          // console.log('onError() ', event)
          context.state.sockets[key].isConnected = false
          context.state.sockets[key].socket = undefined
        }
        sock.onmessage = (event) => {
          context.commit('receiveSocketMessage', { socketId: key, message: event.data })
        }
        context.state.sockets[key].socket = sock
      }
      // todo increase interval to 60?? seconds after x failed attempts
      if (context.state.reconnectInterval === undefined) {
        context.state.reconnectInterval = setInterval(() => {
          context.dispatch('connectAllEnabledSockets')
        }, 2000)
      }
    },
    sendMessage: function (context, data) {
      if (this.state.sockets[data.socketId].isConnected === false) {
        // console.log(`socket '${data.socketId}' is NOT connected! will not send ${data.cmd}`)
        return
      }
      this.state.sockets[data.socketId].socket.send(data.cmd)
    },
    sendMixerParam: function (context, data) {
      console.log(data.socketId, data.mKey, data.mValue) // eslint-disable-line no-console
      this.dispatch(
        'sendMessage',
        {
          socketId: data.socketId,
          cmd: `3:::SET${(typeof data.mValue === 'string' ? 'S' : 'D')}^${data.mKey}^${data.mValue}`
        }
      )
    },
    sendMixerCommand: function (context, data) {
      data.cmd = `3:::${data.cmd}`
      this.dispatch(
        'sendMessage',
        data
      )
    }
  },
  getters: {
    haveValidConfig: state => state.haveValidConfig,
    socketConnected: (state) => (socketId) => { return state.sockets[socketId].isConnected },
    socketEnabled: (state) => (socketId) => { return state.sockets[socketId].config.enabled },
    getCurSetup: (state) => (socketId) => {
      return state.sockets[socketId].config.curSetup
    },
    readRemoteMixerValue: (state) => (args) => {
      // console.log('args', args)
      // return state.mData[keyArg]
      return state.sockets[args.socketId].mData[args.key]
    },
    getEnabledMixerSocketIds (state) {
      const enabledSockets = []
      for (const socketId of ['mixer1', 'mixer2']) {
        if (typeof state.sockets[socketId].socket === 'undefined') {
          continue
        }
        enabledSockets.push(socketId)
      }
      return enabledSockets
    }
  },
  modules: {
  }
})
