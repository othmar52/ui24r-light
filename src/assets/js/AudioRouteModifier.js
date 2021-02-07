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
    if (typeof route.setInput !== 'undefined') {
      setInput(route, route.setInput)
      route.setInput = undefined
    }
    if (typeof route.removeInput !== 'undefined') {
      removeInput(route)
      route.removeInput = undefined
    }

    // auto route to output new routes in case it is required & possible
    if (state.autoRouteSingleOutput === true && route.id === undefined) {
      if (store.getters.getEnabledMatrixOutputs.length === 1) {
        addToTargetChain(route, store.getters.getEnabledMatrixOutputs[0], state)
      }
    }

    store.commit('saveMatrixRoute', route)
    if (state.enableMatrixHelper === true) {
      modifyAffectedRoutes(route, addToTargetChainItem, removeFromTargetChainItem, state)
      if (state.swapOverMoverIsActive === true) {
        // during removing and adding items we may have empty routes that we need to preserve
        return
      }
      store.commit('cleanupEmptyRoutes')
      store.commit('cleanupRoutesWithoutOverOrInput')
      store.commit('cleanupDuplicateRoutes')
    }
    if (state.swapOverMoverIsActive === true) {
      // during removing and adding items we may have empty routes that we need to preserve
      return
    }
    store.commit('cleanupUnusedTargetChains')
    store.commit('cleanupEmptyRoutes')
    store.commit('setIsRoutedAttributes')
    store.commit('updateMixerByMatrixState')
  })

  function setInput (route, inputItem) {
    route.input = inputItem
  }

  function removeInput (route) {
    route.input = undefined
  }

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
      const newTargetChainItems = existingTargetChain.chain.filter(
        item => item.type !== 'output'
      )
      newTargetChainItems.push(addToTargetChainItem)
      route.targetChainId = getOrCreateTargetChainByItems(newTargetChainItems, state).id
      return
    }

    // console.log('we have an over item to add. position is important!')
    const newTargetChain = []
    // iterate over all "over"-items within defined chain sorting
    for (const item of store.getters.getEnabledMatrixOvers) {
      // check if available item has been active before
      let itemExistsInRoute = existingTargetChain.chain.filter(
        item2 => item2.id === item.id
      ).length > 0
      // check if item goes active by current route change request
      if (addToTargetChainItem.id === item.id) {
        itemExistsInRoute = true
      }
      if (itemExistsInRoute === true) {
        newTargetChain.push(item)
      }
    }
    const existingOutput = existingTargetChain.chain.filter(
      item => item.type === 'output'
    )
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
    const newTargetChainItems = existingTargetChain.chain.filter(
      item => item.id !== removeFromTargetChainItem.id
    )
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
    if (addToTargetChainItem !== undefined) {
      modifyAffectedRoutesByAddTargetChain(route, addToTargetChainItem, state)
    }
    if (removeFromTargetChainItem !== undefined) {
      modifyAffectedRoutesByRemoveFromTargetChain(route, removeFromTargetChainItem, state)
    }
  }

  function modifyAffectedRoutesByRemoveFromTargetChain (route, removeFromTargetChainItem, state) {
    // we have to check if removed item is linked to its previous left item somewhere else

    const currentTargetChain = store.getters.getTargetChainById(route.targetChainId)
    if (typeof currentTargetChain === 'undefined') {
      return
    }
    const previousLeftItems = currentTargetChain.chain.filter(
      el => el.type === 'over'
    )
    if (previousLeftItems.length === 0) {
      return
    }

    let indexOfPreviousLeftItem = -1
    let previousLeftItem
    const indexOfRemovedItem = (removeFromTargetChainItem.type === 'over')
      ? store.getters.getEnabledMatrixOvers.map(e => e.id).indexOf(removeFromTargetChainItem.id)
      : store.getters.getEnabledMatrixOvers.length

    for (const item of previousLeftItems) {
      const tmpIndex = store.getters.getEnabledMatrixOvers.map(e => e.id).indexOf(item.id)
      if (tmpIndex > indexOfPreviousLeftItem && tmpIndex < indexOfRemovedItem) {
        indexOfPreviousLeftItem = tmpIndex
        previousLeftItem = item
      }
    }

    if (typeof previousLeftItem === 'undefined') {
      // console.log('111 there was no previous left item. nothing to do...')
      return
    }

    // console.log('search all routes for', previousLeftItem.name, removeFromTargetChainItem.name)
    // apply same removeFromTarget that has the same part of chain
    for (const otherRoute of store.getters.getMatrixRoutes) {
      const otherTargetChain = store.getters.getTargetChainById(otherRoute.targetChainId)
      if (!otherTargetChain) {
        continue
      }
      if (otherTargetChain.chain.filter(
        el => el.id === previousLeftItem.id || el.id === removeFromTargetChainItem.id
      ).length < 2) {
        continue
      }
      removeFromTargetChain(otherRoute, removeFromTargetChainItem, state)
    }
  }

  function modifyAffectedRoutesByAddTargetChain (route, addToTargetChainItem, state) {
    if (route.targetChainId === undefined) {
      return
    }
    // if we have added an over and this over exists in other routes with appended targets
    // append those in our route as well
    // if we have linked over item to the left
    // we have to link target item to the left in all routes
    let weHaveLinkedLeftItem = false
    const currentTargetChain = store.getters.getTargetChainById(route.targetChainId)
    // console.log('currentTargetChain', currentTargetChain)
    // console.log('XXXX store.getters.getEnabledMatrixTargets', store.getters.getEnabledMatrixTargets)
    if (currentTargetChain.chain.length > 1) {
      let leftItem
      const enabledMatrixTargets = JSON.parse(JSON.stringify(store.getters.getEnabledMatrixOvers))
      if (addToTargetChainItem.type === 'output') {
        enabledMatrixTargets.push(addToTargetChainItem)
      }
      // BUG: dont check possible left item but previously linked left item
      for (const enabledMatrixTarget of enabledMatrixTargets) {
        if (typeof leftItem === 'undefined' || enabledMatrixTarget.id !== addToTargetChainItem.id) {
          leftItem = enabledMatrixTarget
          continue
        }
        if (currentTargetChain.chain.filter(el => enabledMatrixTarget.id === el.id).length > 0) {
          if (currentTargetChain.chain.filter(el => leftItem.id === el.id).length > 0) {
            weHaveLinkedLeftItem = leftItem
            // console.log('AAAAA apply same change to all routes that has enabled', weHaveLinkedLeftItem.name)
            break
          }
        }
        leftItem = enabledMatrixTarget
      }
    }
    if (weHaveLinkedLeftItem !== false) {
      // apply same addToTarget that has the left item within its target chain
      for (const otherRoute of store.getters.getMatrixRoutes) {
        const otherTargetChain = store.getters.getTargetChainById(otherRoute.targetChainId)
        if (!otherTargetChain) {
          continue
        }
        if (otherTargetChain.chain.filter(el => el.id === weHaveLinkedLeftItem.id).length === 0) {
          // left item is not in other target chain
          continue
        }
        if (otherTargetChain.chain.filter(el => el.id === addToTargetChainItem.id).length > 0) {
          // item to add is already in target chain
          continue
        }
        addToTargetChain(otherRoute, addToTargetChainItem, state)
      }
    }

    let longestTargetChain = []
    const routesToModify = []
    // let overItemIsAlreadyChainedInOtherAudioRoute = false
    for (const otherRoute of store.getters.getMatrixRoutes) {
      // console.log('otherRoute', otherRoute.targetChainId)
      const otherTargetChain = store.getters.getTargetChainById(otherRoute.targetChainId)
      if (!otherTargetChain) {
        continue
      }
      // console.log('otherTargetChain', otherTargetChain.chain)
      otherTargetChain.chain.forEach(function (overItemOtherRoute, idx) {
        if (overItemOtherRoute.id !== addToTargetChainItem.id) {
          return
        }
        routesToModify.push(otherRoute)
        // console.log('overItemOtherRoute', overItemOtherRoute.name, idx)
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
        // console.log('>>> apply items:', restOfChainToApply)
      })
      // if (overItemOtherRoute.id === )
    }
    if (longestTargetChain.length > 0) {
      // console.log('we have to add chain tail', longestTargetChain, routesToModify)
      applyAddTargetChainToMultipleRoutes(longestTargetChain, routesToModify, state)
    }

    if (addToTargetChainItem.type !== 'output') {
      return
    }
    const currentChainOverItems = currentTargetChain.chain.filter(
      el => el.type === 'over'
    )
    if (currentChainOverItems.length === 0) {
      return
    }
    const lastOverItem = currentChainOverItems[currentChainOverItems.length - 1]
    // apply same output to all routes that has the same last over item
    for (const otherRoute of store.getters.getMatrixRoutes) {
      // console.log('otherRoute', otherRoute.targetChainId)
      const otherTargetChain = store.getters.getTargetChainById(otherRoute.targetChainId)
      if (!otherTargetChain) {
        continue
      }
      const otherOverItems = otherTargetChain.chain.filter(
        el => el.type === 'over'
      )
      if (otherOverItems.length === 0) {
        continue
      }
      const otherChainLastOverItem = otherOverItems[otherOverItems.length - 1]
      // console.log('CCC otherChainLastOverItem', otherChainLastOverItem)
      // console.log('CCC lastOverItem', lastOverItem)
      if (otherChainLastOverItem.id === lastOverItem.id) {
        addToTargetChain(otherRoute, addToTargetChainItem, state)
      }
    }
  }
  function applyAddTargetChainToMultipleRoutes (itemsToAdd, routesToModify, state) {
    for (const routeToModify of routesToModify) {
      for (const addItem of itemsToAdd) {
        addToTargetChain(routeToModify, addItem, state)
      }
    }
    // console.log('### applyAddTargetChainToMultipleRoutes', itemsToAdd, routesToModify)
  }
}

export default AudioRouteModifier
