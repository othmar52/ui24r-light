// import Vue from 'vue'
/* eslint-disable no-unused-expressions, no-fallthrough, no-unused-vars, eqeqeq, no-sequences, camelcase, no-unreachable, indent */
const AudioRouteBuilder = store => {
  store.subscribe((mutation, state) => {
    if (state.enableRouteBuilder === false) {
      return
    }
    if (mutation.type !== 'checkRouteBuilder') {
      return
    }
    let keyList = store.getters.getRouteBuilderKeys
    if (typeof keyList === 'undefined') {
      keyList = createKeyList()
      store.commit('setRouteBuilderKeys', keyList)
    }
    if (typeof keyList[mutation.payload.key] === 'undefined') {
      // remote change does not affect our matrixRoutes
      return
    }
    store.commit('setRouteBuilderActive', true)
    if (keyList[mutation.payload.key].type === 'inToAux') {
      const inputItem = store.getters.getMatrixItemByInputChannel(keyList[mutation.payload.key].inputChannel)
      const outputItem = store.getters.getMatrixItemByOutputChannel(keyList[mutation.payload.key].outputChannel)

      let existingRoutes = state.matrixRoutes.filter(
        r => r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`] &&
              r.stats[`hasOutputChannel.${keyList[mutation.payload.key].outputChannel}`]
      )
      if (existingRoutes.length > 0) {
        // console.log('have existing routes', existingRoutes)
        if (parseInt(mutation.payload.data) === 0) {
          for (const existingRoute of existingRoutes) {
            existingRoute.removeFromTargetChain = outputItem
            store.commit('processRouteChange', existingRoute)
          }
        }
        if (mutation.payload.data > 0) {
          for (const existingRoute of existingRoutes) {
            existingRoute.addToTargetChain = outputItem
            store.commit('processRouteChange', existingRoute)
          }
        }
      } else {
        // search for route with same input but other outpur
        existingRoutes = state.matrixRoutes.filter(
          r => r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`]
        )
        if (existingRoutes.length > 0) {
          if (mutation.payload.data > 0) {
            for (const existingRoute of existingRoutes) {
              existingRoute.addToTargetChain = outputItem
              store.commit('processRouteChange', existingRoute)
            }
          }
        } else {
          if (mutation.payload.data > 0) {
            // console.log('creating new route...')
            const newRoute = store.getters.getRouteById()
            newRoute[(inputItem.type === 'input') ? 'setInput' : 'addToTargetChain'] = inputItem
            store.commit('processRouteChange', newRoute)
            newRoute.addToTargetChain = outputItem
            store.commit('processRouteChange', newRoute)
          }
        }
        // console.log('no route for', keyList[mutation.payload.key].inputChannel, keyList[mutation.payload.key].outputChannel)
      }

      store.commit('setRouteBuilderActive', false)
      store.commit('cleanupEmptyRoutes')
      store.commit('cleanupRoutesWithoutOverOrInput')
      store.commit('cleanupDuplicateRoutes')
      store.commit('cleanupUnusedTargetChains')
      store.commit('cleanupEmptyRoutes')
      store.commit('setIsRoutedAttributes')
      // store.commit('updateMixerByMatrixState')
      return
    }

    if (keyList[mutation.payload.key].type === 'auxMute') {
      if (parseInt(mutation.payload.data) === 0) {
        const existingMutedRoutes = state.matrixRoutes.filter(
          r => r.muted === true && r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`]
        )
        if (existingMutedRoutes.length > 0) {
          // console.log('have existing muted routes', existingMutedRoutes)
          for (const existingRoute of existingMutedRoutes) {
            existingRoute.muted = false
            store.commit('saveMatrixRoute', existingRoute)
          }
        } else {
          // console.log('>>>>>>>>>>   create new muted route ???')
        }
      }

      if (mutation.payload.data > 0) {
        const existingUnmutedRoutes = state.matrixRoutes.filter(
          r => r.muted === false && r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`]
        )
        if (existingUnmutedRoutes.length > 0) {
          // console.log('have existing unmuted routes', existingUnmutedRoutes)
          for (const existingRoute of existingUnmutedRoutes) {
            existingRoute.muted = true
            store.commit('saveMatrixRoute', existingRoute)
          }
        }
      }

      store.commit('setRouteBuilderActive', false)
      store.commit('updateMixerByMatrixState')
    }

    if (keyList[mutation.payload.key].type === 'inputSolo') {
      if (parseInt(mutation.payload.data) === 0) {
        const existingSoloedRoutes = state.matrixRoutes.filter(
          r => r.toHeadphones === true && r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`]
        )
        if (existingSoloedRoutes.length > 0) {
          // console.log('have existing solo routes', existingSoloedRoutes)
          for (const existingRoute of existingSoloedRoutes) {
            existingRoute.toHeadphones = false
            store.commit('saveMatrixRoute', existingRoute)
          }
        } else {
          // console.log('>>>>>>>>>>   create new unsoloed route ???')
        }
      }

      if (mutation.payload.data > 0) {
        // console.log('>>>>>>>>>>>>>>>>>>>>> payload solo', mutation.payload.key)
        const existingUnsoloedRoutes = state.matrixRoutes.filter(
          r => r.toHeadphones === false && r.stats[`hasInputChannel.${keyList[mutation.payload.key].inputChannel}`]
        )
        if (existingUnsoloedRoutes.length > 0) {
          // console.log('>>>>>>>>>>>>>>>>>>>>> have existing unsoloed routes')
          for (const existingRoute of existingUnsoloedRoutes) {
            existingRoute.toHeadphones = true
            store.commit('saveMatrixRoute', existingRoute)
          }
        } else {
          // console.log('>>>>>>>>>>>>>>>>>> creating new soloed route...')
          const newRoute = store.getters.getRouteById()
          const inputItem = store.getters.getMatrixItemByInputChannel(keyList[mutation.payload.key].inputChannel)
          newRoute[(inputItem.type === 'input') ? 'setInput' : 'addToTargetChain'] = inputItem
          newRoute.toHeadphones = true
          store.commit('processRouteChange', newRoute)
        }
      }

      store.commit('setRouteBuilderActive', false)
      store.commit('updateMixerByMatrixState')
    }
  })

  function createKeyList () {
    const keyList = {}
    const curSetup = store.getters.getCurSetup('mixer1')

    for (var i = 0; i < curSetup.input; i++) {
      keyList[`i.${i}.solo`] = {
        type: 'inputSolo',
        inputChannel: i
      }
      for (var a = 0; a < curSetup.aux; a++) {
        // for (var f = 0; f < curSetup.fx; f++) {
          keyList[`i.${i}.aux.${a}.value`] = {
            type: 'inToAux',
            inputChannel: i,
            outputChannel: a
          }
          keyList[`i.${i}.aux.${a}.mute`] = {
            type: 'auxMute',
            inputChannel: i,
            outputChannel: a
          }
          // FX not implemented yet
          // keyList[`i.${i}.fx.${f}.post`] = 0
          // keyList[`i.${i}.fx.${f}.value`] = 0
          // keyList[`i.${i}.fx.${f}.mute`] = 0
          // keyList[`f.${f}.aux.${a}.value`] = 0
          // keyList[`f.${f}.aux.${a}.mute`] = 0
          // keyList[`f.${f}.solo`] = 0
          /*
          if (i < 2) {
            keyList[`l.${i}.aux.${a}.value`] = true
            // keyList[`l.${i}.fx.${f}.post`] = 0
            // keyList[`l.${i}.fx.${f}.value`] = 0
            keyList[`l.${i}.solo`] = true
          }
          */
        // }
      }
    }
    return keyList
  }
}

export default AudioRouteBuilder
