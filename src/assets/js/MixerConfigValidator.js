const MixerConfigValidator = store => {
  console.log('subscribe()')
  store.subscribe(mutation => {
    if (mutation.type === 'retrieveMixerConfig') {
      //    console.log('MixerConfigValidator::setMixerConfig', mutation.payload)
      validate(mutation.payload)
    }
  })

  //  todo: we need at least one enabled mixer socket
  function validate (mixerConfig) {
    console.log('validate()', mixerConfig)
    let isValid = true
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
      mixerConfig[subject].url = `ws://${mixerConfig[subject].ip}/socket.io/1/websocket/sock-${(new Date()).getTime()}${(new Date()).getMilliseconds()}`
    }
    if (isValid === true) {
      store.dispatch('setValidatedMixerConfig', mixerConfig)
    }
    //  console.log('MixerConfigValidator::validate', isValid, mixerConfig)
  }
}

export default MixerConfigValidator
