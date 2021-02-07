/**
 * TODO: MatrixOverMover may fail in case we have disabled over items
 * (state.matrixOvers vs. state.enabledMatrixOvers)
 * @param {*} store
 */
const MatrixOverMover = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'moveOverItemToLeft') {
      return
    }
    const inputChannels = mutation.payload

    let itemPosition
    state.matrixOvers.forEach(function (over, idx) {
      if (inputChannels === over.inputChannels.join(',')) {
        itemPosition = idx
      }
    })
    if (itemPosition === 0) {
      // console.log('item is already very left')
      return
    }

    const itemsToSwap = [
      state.matrixOvers[itemPosition],
      state.matrixOvers[itemPosition - 1]
    ]

    // console.log('move over from index', itemPosition, 'to', itemPosition + 1)
    state.matrixOvers.splice(itemPosition, 0, state.matrixOvers.splice(itemPosition - 1, 1)[0])
    store.commit('setMatrixOvers', state.matrixOvers)

    // we need to modify all existing routes that has both items in target chain
    const routeIdsToModify = []
    for (const audioRoute of store.getters.getMatrixRoutes) {
      const targetChain = store.getters.getTargetChainById(audioRoute.targetChainId)
      if (!targetChain) {
        continue
      }
      if (targetChain.chain.filter(el => el.id === itemsToSwap[0].id).length !== 1 ||
          targetChain.chain.filter(el => el.id === itemsToSwap[1].id).length !== 1) {
        // at least one of swapped items does not exist in audio routes targetChain
        continue
      }
      routeIdsToModify.push(audioRoute.id)
    }

    // console.log('routeIdsToModify', routeIdsToModify)
    if (routeIdsToModify.length === 0) {
      // we have no affected audio routes
      return
    }

    store.commit('setSwapOverMoverIsActiveTo', true)
    for (const routeId of routeIdsToModify) {
      // remove first swapped item
      const route = store.getters.getRouteById(routeId)
      route.removeFromTargetChain = itemsToSwap[0]
      store.commit('processRouteChange', route)
      // remove 2nd swapped item
      // route = store.getters.getRouteById(routeId)
      route.removeFromTargetChain = itemsToSwap[1]
      store.commit('processRouteChange', route)
      // add first swapped item
      // route = store.getters.getRouteById(routeId)
      route.addToTargetChain = itemsToSwap[0]
      store.commit('processRouteChange', route)
      // add 2nd swapped item
      // route = store.getters.getRouteById(routeId)
      route.addToTargetChain = itemsToSwap[1]
      store.commit('processRouteChange', route)
    }
    store.commit('setSwapOverMoverIsActiveTo', false)
    if (state.enableMatrixHelper === true) {
      store.commit('cleanupEmptyRoutes')
      store.commit('cleanupRoutesWithoutOverOrInput')
      store.commit('cleanupDuplicateRoutes')
    }
    store.commit('cleanupUnusedTargetChains')
    store.commit('cleanupEmptyRoutes')
    store.commit('setIsRoutedAttributes')
    store.commit('updateMixerByMatrixState')
  })
}

export default MatrixOverMover
