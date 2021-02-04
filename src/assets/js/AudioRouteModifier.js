// import Vue from 'vue'

const AudioRouteModifier = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'processRouteChange') {
      return
    }
    const route = mutation.payload
    let addToTargetChainItem
    let removeFromTargetChainItem
    if (typeof route.addToTargetChain !== 'undefined') {
      addToTargetChainItem = route.addToTargetChain
      route.addToTargetChain = undefined
      addToTargetChain(route, addToTargetChainItem, state)
    }
    if (typeof route.removeFromTargetChain !== 'undefined') {
      removeFromTargetChainItem = route.removeFromTargetChain
      route.removeFromTargetChain = undefined
      removeFromTargetChain(route, removeFromTargetChainItem, state)
    }
    // TODO handle input toggle over this plugin as well?
    store.commit('saveMatrixRoute', route)
    modifyAffectedRoutes(route, addToTargetChainItem, removeFromTargetChainItem, state)

    store.commit('cleanupUnusedTargetChains')
    store.commit('cleanupEmptyRoutes')
    // TODO modify all affected routes
    // TODO cleanupDuplicateRoutes
  })

  function getOrCreateTargetChainByItems (items) {
    const chainIds = []
    for (const item of items) {
      chainIds.push(item.id)
    }
    const newChain = {
      id: chainIds.join('-'),
      chain: items
    }
    store.commit('addTargetChain', newChain)
    // console.log('the new chain is', newChain.id, newChain.chain.length)
    return newChain
  }

  function addToTargetChain (route, addToTargetChainItem, state) {
    let existingTargetChain = store.getters.getTargetChainById(route.targetChainId)

    if (typeof existingTargetChain === 'undefined') {
      existingTargetChain = getOrCreateTargetChainByItems([addToTargetChainItem], state)
    }

    // if item to add is output simply add or replace output
    if (addToTargetChainItem.type === 'output') {
      // console.log('we have an output')
      const newTargetChainItems = existingTargetChain.chain.filter(function (item) {
        return item.type !== 'output'
      })
      newTargetChainItems.push(addToTargetChainItem)
      route.targetChainId = getOrCreateTargetChainByItems(newTargetChainItems, state).id
      return
    }

    // console.log('we have an over item to add. position is important!')
    const newTargetChain = []
    // iterate over all "over"-items within defined chain sorting
    for (const item of store.getters.getEnabledMatrixOvers) {
      // check if available item has been active before
      let itemExistsInRoute = existingTargetChain.chain.filter(function (item2) {
        return item2.id === item.id
      }).length > 0
      // check if item goes active by current route change request
      if (addToTargetChainItem.id === item.id) {
        itemExistsInRoute = true
      }
      if (itemExistsInRoute === true) {
        newTargetChain.push(item)
      }
    }
    const existingOutput = existingTargetChain.chain.filter(function (item) {
      return item.type === 'output'
    })
    if (existingOutput.length > 0) {
      newTargetChain.push(existingOutput[0])
    }
    route.targetChainId = getOrCreateTargetChainByItems(newTargetChain, state).id
  }

  function removeFromTargetChain (route, removeFromTargetChainItem, state) {
    const existingTargetChain = store.getters.getTargetChainById(route.targetChainId)
    if (typeof existingTargetChain === 'undefined') {
      route.targetChainId = undefined
      return
    }
    const newTargetChainItems = existingTargetChain.chain.filter(function (item) {
      return item.id !== removeFromTargetChainItem.id
    })
    if (newTargetChainItems.length === 0) {
      route.targetChainId = undefined
      return
    }
    route.targetChainId = getOrCreateTargetChainByItems(newTargetChainItems, state).id
  }

  function modifyAffectedRoutes (route, addToTargetChainItem, removeFromTargetChainItem, state) {
    if (route.targetChainId === undefined) {
      return
    }

    // if we have added an over and this over exists in other routes with appended targets
    // append those in our route as well
    if (addToTargetChainItem !== undefined) {
      if (addToTargetChainItem.type !== 'ov-er') {
        let longestTargetChain = []
        const routesToModify = []
        // let overItemIsAlreadyChainedInOtherAudioRoute = false
        for (const otherRoute of store.getters.getMatrixRoutes) {
          console.log('otherRoute', otherRoute.targetChainId)
          const otherTargetChain = store.getters.getTargetChainById(otherRoute.targetChainId)
          if (!otherTargetChain) {
            continue
          }
          console.log('otherTargetChain', otherTargetChain.chain)
          otherTargetChain.chain.forEach(function (overItemOtherRoute, idx) {
            if (overItemOtherRoute.id !== addToTargetChainItem.id) {
              return
            }
            routesToModify.push(otherRoute)
            console.log('overItemOtherRoute', overItemOtherRoute.name, idx)
            if (otherTargetChain.chain.length < idx) {
              return
            }
            const otherTargetChainCopy = JSON.parse(JSON.stringify(otherTargetChain))
            const restOfChainToApply = otherTargetChainCopy.chain.splice(idx + 1)
            // const restOfChainToApply = otherTargetChainCopy
            if (restOfChainToApply.length === 0) {
              return
            }
            if (longestTargetChain.length < restOfChainToApply.length) {
              longestTargetChain = restOfChainToApply
            }
            console.log('>>> apply items:', restOfChainToApply)
          })
          // if (overItemOtherRoute.id === )
        }
        if (longestTargetChain.length > 0) {
          // console.log('we have to add chain tail', longestTargetChain, routesToModify)
          applyAddTargetChainToMultipleRoutes(longestTargetChain, routesToModify, state)
        }
      }
    }

    const targetChainOfTruth = store.getters.getTargetChainById(route.targetChainId)
    //  const targetChainOfTruthOutput = targetChainOfTruth.chain.filter(function (el) { return el.type === 'output' })[0]
    // const
    console.log('updateAllAffectedTargetChains', 'id:', targetChainOfTruth.id, 'chain:', targetChainOfTruth.chain)
    for (const overItem of targetChainOfTruth.chain.filter(function (el) { return el.type === 'over' })) {
      console.log('overItem', overItem.name)
    }
  }

  function applyAddTargetChainToMultipleRoutes (itemsToAdd, routesToModify, state) {
    for (const route of routesToModify) {
      for (const addItem of itemsToAdd) {
        addToTargetChain(route, addItem, state)
      }
    }
    // console.log('### applyAddTargetChainToMultipleRoutes', itemsToAdd, routesToModify)
  }
}

export default AudioRouteModifier
