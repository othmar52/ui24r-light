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
      addToTargetChain(route, state)
    }
    if (typeof route.removeFromTargetChain !== 'undefined') {
      removeFromTargetChainItem = route.removeFromTargetChain
      removeFromTargetChain(route, state)
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

  function addToTargetChain (route, state) {
    let existingTargetChain = store.getters.getTargetChainById(route.targetChainId)

    if (typeof existingTargetChain === 'undefined') {
      existingTargetChain = getOrCreateTargetChainByItems([route.addToTargetChain], state)
    }

    // if item to add is output simply add or replace output
    if (route.addToTargetChain.type === 'output') {
      // console.log('we have an output')
      const newTargetChainItems = existingTargetChain.chain.filter(function (item) {
        return item.type !== 'output'
      })
      newTargetChainItems.push(route.addToTargetChain)
      route.addToTargetChain = undefined
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
      if (route.addToTargetChain.id === item.id) {
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
    route.addToTargetChain = undefined
    route.targetChainId = getOrCreateTargetChainByItems(newTargetChain, state).id
  }

  function removeFromTargetChain (route, state) {
    const existingTargetChain = store.getters.getTargetChainById(route.targetChainId)
    if (typeof existingTargetChain === 'undefined') {
      route.targetChainId = undefined
      route.removeFromTargetChain = undefined
      return
    }
    const newTargetChainItems = existingTargetChain.chain.filter(function (item) {
      return item.id !== route.removeFromTargetChain.id
    })
    route.removeFromTargetChain = undefined
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
    const targetChainOfTruth = store.getters.getTargetChainById(route.targetChainId)
    //  const targetChainOfTruthOutput = targetChainOfTruth.chain.filter(function (el) { return el.type === 'output' })[0]
    // const
    console.log('updateAllAffectedTargetChains', 'id:', targetChainOfTruth.id, 'chain:', targetChainOfTruth.chain)
    for (const overItem of targetChainOfTruth.chain.filter(function (el) { return el.type === 'over' })) {
      console.log('overItem', overItem.name)
    }
  }
}

export default AudioRouteModifier
