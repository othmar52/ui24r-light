const MixerConfigValidator = store => {
  store.subscribe(mutation => {
    if (mutation.type === 'retrieveMixerConfig') {
      validate(mutation.payload)
    }
  })

  //  todo: we need at least one enabled mixer socket
  function validate (mixerConfig) {
    let isValid = true
    let atLeastOneMixerEnabled = false
    for (const subject of ['mixer1', 'mixer2']) {
      if (typeof mixerConfig[subject] === 'undefined') {
        isValid = false
        continue
      }
      if (typeof mixerConfig[subject].enabled === 'undefined') {
        isValid = false
        continue
      }
      if (typeof mixerConfig[subject].enabled !== 'boolean') {
        isValid = false
        continue
      }
      if (mixerConfig[subject].enabled === true) {
        atLeastOneMixerEnabled = true
      }
      // todo url schema of mixers(ui24r) vs. url of paramRecorder
      mixerConfig[subject].url = `ws://${mixerConfig[subject].ip}/socket.io/1/websocket/sock-${(new Date()).getTime()}${(new Date()).getMilliseconds()}`
      mixerConfig[subject].curSetup = {
        input: 24,
        linein: 2,
        fx: 4,
        aux: 10,
        sub: 6,
        rec: true,
        zeroDbPos: 0.7647058823529421
      }
    }

    for (const subject of ['paramRecorder1', 'paramRecorder2']) {
      if (typeof mixerConfig[subject] === 'undefined') {
        isValid = false
        continue
      }
      if (typeof mixerConfig[subject].enabled === 'undefined') {
        isValid = false
        continue
      }
      if (typeof mixerConfig[subject].enabled !== 'boolean') {
        isValid = false
        continue
      }
      // todo url schema of mixers(ui24r) vs. url of paramRecorder
      mixerConfig[subject].url = `ws://${mixerConfig[subject].ip}:${mixerConfig[subject].port}`
    }

    if (atLeastOneMixerEnabled === false) {
      isValid = false
    }

    // TODO: make sure we have no duplicates in channels coonfiguration
    if (typeof mixerConfig.matrixInputsConf !== 'undefined') {
      store.dispatch('setMatrixInputsConf', mixerConfig.matrixInputsConf)
    }
    if (typeof mixerConfig.matrixOutputsConf !== 'undefined') {
      store.dispatch('setMatrixOutputsConf', mixerConfig.matrixOutputsConf)
    }
    if (typeof mixerConfig.matrixOverConf !== 'undefined') {
      store.dispatch('setMatrixOverConf', mixerConfig.matrixOverConf)
    }

    if (isValid === false) {
      return
    }
    store.dispatch('setValidatedMixerConfig', mixerConfig)
  }
}

export default MixerConfigValidator
