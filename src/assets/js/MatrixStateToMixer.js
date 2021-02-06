// import Vue from 'vue'

const MatrixStateToMixer = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'updateMixerByMatrixState') {
      return
    }
    applyParamsToSocket(state)
  })

  function applyParamsToSocket (state) {
    const initialState = getInitialState()
    for (const audioRoute of state.matrixRoutes.filter(el => typeof el !== 'undefined')) {
      /*
      try {
        handleMonoStereoComboFromTo(
          audioRoute.input,
          store.getters.getTargetChainById(audioRoute.targetChainId)[0],
          initialState
        )
      } catch (e) {
        continue
      }
      */
      const targetChain = store.getters.getTargetChainById(audioRoute.targetChainId)
      if (typeof targetChain === 'undefined') {
        continue
      }
      if (typeof audioRoute.input === 'undefined') {
        continue
      }
      const target = targetChain.chain[0]
      handleMonoStereoComboFromTo(audioRoute.input, target, initialState)
    }

    for (const targetChain of Object.entries(state.matrixTargetChains)) {
      if (targetChain[1].chain.length <= 1) {
        // already done in previous loop or nothing to do
        continue
      }
      for (let i = 0; i < targetChain[1].chain.length - 1; i++) {
        // route all pairs we have in our targetChain
        // console.log('from', targetChain[1].chain[i].name, 'to:', targetChain[1].chain[i + 1].name)
        handleMonoStereoComboFromTo(targetChain[1].chain[i], targetChain[1].chain[i + 1], initialState)
      }
    }

    for (const [key, value] of Object.entries(initialState)) {
      if (value === store.getters.readRemoteMixerValue({ socketId: 'mixer1', key: key })) {
        // no need to modify the param because it has the value we need
        continue
      }
      console.log(`${key}: ${value} remote: ${store.getters.readRemoteMixerValue({ socketId: 'mixer1', key: key })}`) // eslint-disable-line no-console
      // todo: unify object keys for both mutation arguments
      store.dispatch(
        'sendMixerParam',
        {
          socketId: 'mixer1',
          mKey: key,
          mValue: value
        }
      )
      store.commit(
        'updateMixerData',
        {
          socketId: 'mixer1',
          key: key,
          data: value
        }
      )
    }
  }

  // TODO respect "fakeStereo property"
  function handleMonoStereoComboFromTo (source, target, initialState) {
    // console.log('handleMonoStereoComboFromTo', source, target)
    // nothing to do without source or target channels (TODO: move to MixerConfigValidator)
    if (source.inputChannels.length === 0 || target.outputChannels.length === 0) {
      return
    }

    // mono input to mono output & all other scenarios
    setInAuxLevel(source.inputChannels[0], target.outputChannels[0], source.defaultDbPos, initialState)

    // stereo input to stereo output
    if (source.inputChannels.length === 2 && target.outputChannels.length === 2) {
      setInAuxLevel(source.inputChannels[1], target.outputChannels[1], source.defaultDbPos, initialState)
      return
    }

    // stereo input to mono output
    if (source.inputChannels.length === 2 && target.outputChannels.length === 1) {
      setInAuxLevel(source.inputChannels[1], target.outputChannels[0], source.defaultDbPos, initialState)
      return
    }

    // mono input to stereo output
    if (source.inputChannels.length === 1 && target.outputChannels.length === 2) {
      setInAuxLevel(source.inputChannels[0], target.outputChannels[1], source.defaultDbPos, initialState)
    }
  }

  function setInAuxLevel (inputChannelIdx, auxChannelIdx, targetLevel, initialState) {
    initialState[`i.${inputChannelIdx}.aux.${auxChannelIdx}.value`] = targetLevel
  }

  // function setMixerValueDebug (key, value) {
  //  console.log('FAKE setMixerValueDebug', key, value)
  // }

  function getInitialState () {
    const initialState = {}
    const curSetup = store.getters.getCurSetup('mixer1')

    for (var i = 0; i < curSetup.input; i++) {
      for (var a = 0; a < curSetup.aux; a++) {
        for (var f = 0; f < curSetup.fx; f++) {
          initialState[`i.${i}.aux.${a}.postproc`] = 1
          initialState[`i.${i}.aux.${a}.value`] = 0
          initialState[`i.${i}.fx.${f}.post`] = 0
          initialState[`i.${i}.fx.${f}.value`] = 0
          initialState[`f.${f}.aux.${a}.post`] = 0
          initialState[`f.${f}.aux.${a}.value`] = 0
          initialState[`i.${i}.solo`] = 0
          initialState[`f.${f}.solo`] = 0
          if (i < 2) {
            initialState[`l.${i}.aux.${a}.postproc`] = 1
            initialState[`l.${i}.aux.${a}.value`] = 0
            initialState[`l.${i}.fx.${f}.post`] = 0
            initialState[`l.${i}.fx.${f}.value`] = 0
            initialState[`l.${i}.solo`] = 0
          }
        }
        initialState[`a.${a}.vca`] = -1
      }
    }
    let first = 0
    for (const item of store.getters.getMatrixInputs) {
      first = 0
      for (const chIndex of item.inputChannels) {
        initialState[`i.${chIndex}.name`] = item.name
        initialState[`i.${chIndex}.color`] = item.color
        if (item.inputChannels.length === 1) {
          initialState[`i.${chIndex}.stereoIndex`] = -1
          initialState[`i.${chIndex}.pan`] = 0.5
          continue
        }
        initialState[`i.${chIndex}.stereoIndex`] = first
        initialState[`i.${chIndex}.pan`] = first
        first++
      }
    }

    for (const item of store.getters.getMatrixOutputs.concat(store.getters.getMatrixOvers)) {
      first = 0
      for (const chIndex of item.outputChannels) {
        initialState[`a.${chIndex}.name`] = item.name
        initialState[`a.${chIndex}.stereoIndex`] = -1
        initialState[`a.${chIndex}.pan`] = 0.5
        if (item.outputChannels.length === 1) {
          continue
        }
        if (item.fakeStereo === true) {
          continue
        }
        initialState[`a.${chIndex}.stereoIndex`] = first
        initialState[`a.${chIndex}.pan`] = first

        // TODO: check if this AUX panning is correct
        for (const inputItem of store.getters.getMatrixInputs) {
          if (inputItem.inputChannels.length === 1) {
            continue
          }
          initialState[`i.${inputItem.inputChannels[1]}.aux.${item.outputChannels[0]}.pan`] = 1
          initialState[`i.${inputItem.inputChannels[1]}.aux.${item.outputChannels[1]}.pan`] = 1
          initialState[`i.${inputItem.inputChannels[0]}.aux.${item.outputChannels[0]}.pan`] = 0
          initialState[`i.${inputItem.inputChannels[0]}.aux.${item.outputChannels[1]}.pan`] = 0
        }

        first++
      }
    }

    // misuse physical master out as aux 10|11
    initialState['hwoutm.0.src'] = 'a.8'
    initialState['hwoutm.1.src'] = 'a.9'

    // treat physical line ins's as IN 21|22 instead of LINE 1|2
    initialState['l.0.src'] = 'none'
    initialState['l.1.src'] = 'none'
    initialState['i.20.src'] = 'li.0'
    initialState['i.21.src'] = 'li.1'
    return initialState
  }
}

export default MatrixStateToMixer
