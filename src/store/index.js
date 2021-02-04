import Vue from 'vue'
import Vuex from 'vuex'
import MixerConfigValidator from '../assets/js/MixerConfigValidator'
import Ui24rMessageParser from '../assets/js/Ui24rMessageParser'
import AudioRouteModifier from '../assets/js/AudioRouteModifier'
// import AudioRoute from '../assets/js/AudioRoute'

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
    },
    matrixInputs: [],
    matrixOutputs: [],
    matrixOvers: [],

    matrixRoutesIdCounter: 0,
    matrixRoutes: [],
    matrixTargetChains: {},
    /*

      chainedOvers: [

      ]
      activeOverLinks: [
        {
          fromInputChannels:
          toOutputChannels
          outputChannels:
          isChainedToNext: true|false
          isChainedToOutput: true|false
        }
      ]
    */

    // chain can not be modified individually. signal flow will apply to all inputs within the chain
    matrixOverChain: [],

    exampleRoute: {
      from: {
        input: {},
        muted: false,
        toHeadphones: false
      },
      over: [],
      to: {
        output: {},
        level: 0.5,
        fx1: false,
        fx2: false,
        fx3: false,
        fx4: false
      }
    }
  },
  plugins: [
    MixerConfigValidator,
    Ui24rMessageParser,
    AudioRouteModifier
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
    },
    toggleEnableMatrixInput (state, payload) {
      // iterate until we find the matching input item
      for (const item of state.matrixInputs) {
        if (item.inputChannels.join(',') !== payload.channels) {
          continue
        }
        item.enabled = payload.enabled !== 'true'
        return
      }
    },
    toggleEnableMatrixOutput (state, payload) {
      // iterate until we find the matching output item
      for (const item of state.matrixOutputs) {
        if (item.outputChannels.join(',') !== payload.channels) {
          continue
        }
        item.enabled = payload.enabled !== 'true'
        return
      }
    },
    toggleEnableMatrixOver (state, payload) {
      // iterate until we find the matching output item
      for (const item of state.matrixOvers) {
        if (item.outputChannels.join(',') !== payload.channels) {
          continue
        }
        item.enabled = payload.enabled !== 'true'
        return
      }
    },
    moveOverItemToRight (state, inputChannels) {
      if (state.matrixOvers.length < 2) {
        // console.log('nothing to move left...')
        return
      }
      let itemPosition
      state.matrixOvers.forEach(function (over, idx) {
        if (inputChannels === over.inputChannels.join(',')) {
          itemPosition = idx
        }
      })
      if (itemPosition === state.matrixOvers.length) {
        // console.log('item is already very right')
        return
      }
      // console.log('move over from index', itemPosition, 'to', itemPosition + 1)
      state.matrixOvers.splice(itemPosition + 1, 0, state.matrixOvers.splice(itemPosition, 1)[0])
    },
    setDefaultMatrixPreset (state) {
      // TODO remove all routes that includes disabled items (consider to keep with invalid flag)
      for (const item of state.matrixInputs) {
        item.enabled = item.enabledDefault
      }
      for (const item of state.matrixOutputs) {
        item.enabled = item.enabledDefault
      }
      for (const item of state.matrixOvers) {
        item.enabled = item.enabledDefault
      }
    },
    saveMatrixRoute: (state, route) => {
      if (route.input) {
        route.input.isRouted = true
      }
      if (typeof route.id === 'undefined') {
        route.id = state.matrixRoutesIdCounter
        state.matrixRoutesIdCounter++
        state.matrixRoutes.push(route)
        return
      }
      const routesCopy = []
      for (const item of state.matrixRoutes) {
        if (item.id === route.id) {
          routesCopy.push(route)
          continue
        }
        routesCopy.push(item)
      }
      state.matrixRoutes = routesCopy
    },
    cleanupUnusedTargetChains (state) {
      const targetChainCopy = {}
      for (const [targetChainId, targetChain] of Object.entries(state.matrixTargetChains)) {
        for (const matrixRoute of state.matrixRoutes) {
          if (matrixRoute.targetChainId === targetChainId) {
            targetChainCopy[targetChainId] = targetChain
            break
          }
        }
      }
      Vue.set(state, 'matrixTargetChains', targetChainCopy)
    },
    addTargetChain (state, targetChain) {
      Vue.set(state.matrixTargetChains, targetChain.id, targetChain)
    },
    cleanupEmptyRoutes (state) {
      state.matrixRoutes = state.matrixRoutes.filter(function (item) {
        return typeof item.input !== 'undefined' ||
               typeof item.targetChainId !== 'undefined'
      })
    },
    deleteMatrixRouteById (state, routeId) {
      state.matrixRoutes = state.matrixRoutes.filter(function (item) {
        return item.id !== routeId
      })
    },
    resetAudioRoutes (state) {
      state.matrixRoutes = []
      state.matrixTargetChains = []
    },
    setIsRoutedAttributes (state) {
      const routedInputs = []
      for (const item of state.matrixRoutes) {
        if (typeof item.input === 'undefined') {
          continue
        }
        routedInputs.push(item.input.inputChannels.join(','))
      }
      for (const item of state.matrixInputs) {
        item.isRouted = routedInputs.includes(item.inputChannels.join(','))
      }
    },
    /**
     * tricky stuff: modify over chains and outputs of all audio routes if necessary
     */
    applyOverChainsAndOutputs (state) {
      const overChains = []

      for (let i = 0; i < state.matrixOvers.filter(function (item) { return item.enabled === true }).length; i++) {
        overChains.push([])
      }
      console.log('overChains', overChains)
      // for (const audioRoute of ) {
      // }
    },
    processRouteChange: function () {
      // @see src/assets/js/AudioRouteModifier.js
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
    setMatrixInputsConf: function (context, matrixInputsConf) {
      //  console.log('setMixerConfig ', mixerConfig)
      for (const item of matrixInputsConf) {
        item.enabledDefault = item.enabled
        item.type = 'input'
        item.isRouted = false
      }
      context.state.matrixInputs = matrixInputsConf
    },
    setMatrixOutputsConf: function (context, matrixOutputsConf) {
      for (const item of matrixOutputsConf) {
        item.enabledDefault = item.enabled
        item.type = 'output'
        item.id = item.outputChannels.join(',')
      }
      context.state.matrixOutputs = matrixOutputsConf
    },
    setMatrixOverConf: function (context, matrixOverConf) {
      for (const item of matrixOverConf) {
        item.enabledDefault = item.enabled
        item.type = 'over'
        item.id = item.outputChannels.join(',')
      }
      context.state.matrixOvers = matrixOverConf
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
      // console.log(data.socketId, data.mKey, data.mValue) // eslint-disable-line no-console
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
    getMatrixInputs: state => state.matrixInputs,
    getMatrixOutputs: state => state.matrixOutputs,
    getMatrixRoutes: state => state.matrixRoutes,
    getMatrixTargetChains: state => state.matrixTargetChains, // only for debugging
    socketConnected: (state) => (socketId) => { return state.sockets[socketId].isConnected },
    socketEnabled: (state) => (socketId) => { return state.sockets[socketId].config.enabled },
    getCurSetup: (state) => (socketId) => {
      return state.sockets[socketId].config.curSetup
    },
    getRouteById: (state) => (routeId) => {
      const filtered = state.matrixRoutes.filter(function (el) {
        return el.id === routeId
      })
      if (filtered.length > 0) {
        return filtered[0]
      }
      return {
        id: undefined,
        input: undefined,
        muted: false,
        toHeadphones: false,
        targetChainId: undefined,
        removeFromTargetChain: undefined,
        addToTargetChain: undefined
      }
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
    },
    getUnroutedMatrixInputs: state => state.matrixInputs.filter(function (el) {
      return el.enabled === true && el.isRouted === false
    }),
    getEnabledMatrixOutputs: state => state.matrixOutputs.filter(function (el) {
      return el.enabled === true
    }),
    getEnabledMatrixOvers: state => state.matrixOvers.filter(function (el) {
      return el.enabled === true
    }),
    getTargetChainById: (state) => (targetChainId) => {
      return state.matrixTargetChains[targetChainId]
    }
  },
  modules: {
  }
})
