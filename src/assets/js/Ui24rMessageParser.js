/* todo: re-enable linter and fix this horrible file copied from original ui24r webinterface */
/* eslint-disable no-unused-expressions, no-fallthrough, no-unused-vars, eqeqeq, no-sequences, camelcase */
const Ui24rMessageParser = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'receiveSocketMessage') {
      // console.log(mutation.payload.message)
      receiveMessages(mutation.payload.message, mutation.payload.socketId, state)
    }
  })

  function receiveMessages (data, socketId, state) {
    data = data.split(/\n/)
    data.forEach(lineData => (
      receiveMessage(lineData, socketId, state)
    ))
  }

  function receiveMessage (data, socketId, state) {
    if (!data) { return }

    if (socketId === 'paramRecorder1' || socketId === 'paramRecorder2') {
      return receiveParamRecorderMessage(data, socketId)
    }
    if (data.startsWith('SETD^')) {
      var b = data.split('^', 3)
      b.length < 3 || putValue(b[1], parseFloat(b[2]), socketId)
    } else {
      data.startsWith('SETS^')
        ? (b = data.split('^', 3), b.length < 3 || putValue(b[1], b[2], socketId))
        : parseCommand(data, socketId, state)
    }
  }

  function receiveParamRecorderMessage (data, socketId) {
    let responseData
    // try to parse response as json
    try {
      responseData = JSON.parse(data)
    } catch (e) {
      // console.log('not able to parse response as json', e, socketId, data)
      return
    }
    store.commit('updateMixerData', { socketId: socketId, key: 'armed', data: responseData.armed })
  }

  function putValue (paramName, paramValue, socketId) {
    store.commit('updateMixerData', { socketId: socketId, key: paramName, data: paramValue })
    store.commit('checkRouteBuilder', { socketId: socketId, key: paramName, data: paramValue })
  }

  function parseCommand (msg, socketId, state) {
    /// * eslint-disable no-unreachable */
    // return;
    switch (true) {
      case msg.startsWith('VU2^'):
        if (state.sockets[socketId].enableVu !== true) {
          return
        }
        if (state.sockets[socketId].debounceVu === true) {
          if (store.getters.getIgnoreVuData(socketId) === true) {
            // console.log('skipping')
            return
          }
        }
        // console.log('processing')
        return parseVUdata(msg, socketId)

      case msg.startsWith('INIT^'):
        // console.log('init() in parser')
        Object.extend(
          // appData.mData,
          JSON.parse(msg.substring(5))
        )

      case msg.startsWith('VUA^'):
      case msg.startsWith('RTA^'):
      case msg.startsWith('BMSG^'):
      case msg.startsWith('MSG^'):
      case msg.startsWith('DLGSHOW^'):
      case msg.startsWith('DLGHIDE^'):
      case msg.startsWith('SHOWLIST^'):
      case msg.startsWith('SNAPSHOTLIST^'):
      case msg.startsWith('CUELIST^'):
      case msg.startsWith('PRESETLIST^'):
      case msg.startsWith('USBMOUNTS^'):
      case msg.startsWith('IMPORTSHOWLIST^'):
      case msg.startsWith('READPRESET^'):
      case msg.startsWith('PLISTS^'):
      case msg.startsWith('PLIST_TRACKS^'):
      case msg.startsWith('MTK_GET_SESSIONS^'):
      case msg.startsWith('MTK_GET_FILES^'):
      case msg.startsWith('TIMEDIALOG^'):
      case (msg === 'RELOAD'):
      case msg.startsWith('SERIAL'):
        // not implemented yet
    }
  }

  function parseVUdata (a, socketId) {
    // console.log("sxfghxh");
    // TODO: skip by configuration
    // if (settings.states || settings.states2) {
    //    return;
    // }

    const vuData = []

    a = atob(a.slice(4))

    for (var b = false, c = false, e = 8, g = 0, h = a.charCodeAt(0); g < h && !(g >= store.getters.getCurSetup(socketId).input); g++) {
      var l = e + 6 * g
      var m = deconvertVU(a.charCodeAt(l + 0))
      var n = deconvertVU(a.charCodeAt(l + 1))
      var q = deconvertVU(a.charCodeAt(l + 2))
      var r = deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1)
      var p = (a.charCodeAt(l + 5) & 128) != 0
      // appData.vu["i." + g + ".mix"] = { pre: n, post: q };
      // store.commit('updateMixerData', { socketId: socketId, key: `vu.i.${g}.mix`, data: { pre: n, post: q } })
      vuData.push({ key: `vu.i.${g}.mix`, data: { pre: n, post: q } })
    }
    l = e += 6 * a.charCodeAt(0)
    n = deconvertVU(a.charCodeAt(l + 1))
    q = deconvertVU(a.charCodeAt(l + 2))
    r = deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1)
    p = (a.charCodeAt(l + 5) & 128) != 0

    l = e + 6
    n = deconvertVU(a.charCodeAt(l + 1))
    q = deconvertVU(a.charCodeAt(l + 2))
    r = deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1)
    p = (a.charCodeAt(l + 5) & 128) != 0

    e += 6 * a.charCodeAt(1)

    for (g = 0; g < a.charCodeAt(2) && !(g >= store.getters.getCurSetup(socketId).sub); g++) {
      l = e + 7 * g,
      n = deconvertVU(a.charCodeAt(l + 0)),
      q = deconvertVU(a.charCodeAt(l + 1)),
      h = deconvertVU(a.charCodeAt(l + 2)),
      m = deconvertVU(a.charCodeAt(l + 3)),
      r = deconvertVU_comp((a.charCodeAt(l + 6) & 127) << 1),
      p = (a.charCodeAt(l + 6) & 128) != 0,

      // TODO: check if pushed values for submix are correct (maybe post: h )
      // globalVUvalues.STRIPS.SUB[g].vu = [n, h, q, m, r, r, p, p],
      // appData.vu["s." + g + ".mix"] = { pre: n, post: q };
      // store.commit('updateMixerData', { socketId: socketId, key: `vu.s.${g}.mix`, data: { pre: n, post: q } })
      vuData.push({ key: `vu.s.${g}.mix`, data: { pre: n, post: q } })
    }

    e += 7 * a.charCodeAt(2)
    for (g = 0; g < a.charCodeAt(3) && !(g >= store.getters.getCurSetup(socketId).fx); g++) {
      l = e + 7 * g,
      n = deconvertVU(a.charCodeAt(l + 0)),
      q = deconvertVU(a.charCodeAt(l + 1)),
      h = deconvertVU(a.charCodeAt(l + 2)),
      m = deconvertVU(a.charCodeAt(l + 3)),
      r = deconvertVU_comp((a.charCodeAt(l + 6) & 127) << 1),
      p = (a.charCodeAt(l + 6) & 128) != 0,

      // TODO: check if pushed values for fx are correct
      // globalVUvalues.STRIPS.FX[g].vu = [n, h, q, m, r, r, p, p] (maybe post: h )
      // appData.vu["fx." + g + ".mix"] = { pre: n, post: q };
      // store.commit('updateMixerData', { socketId: socketId, key: `vu.fx.${g}.mix`, data: { pre: n, post: q } })
      vuData.push('updateMixerData', { key: `vu.fx.${g}.mix`, data: { pre: n, post: q } })
    }

    e += 7 * a.charCodeAt(3)
    for (g = 0; g < a.charCodeAt(4) && !(g >= store.getters.getCurSetup(socketId).aux); g++) {
      l = e + 5 * g,
      n = deconvertVU(a.charCodeAt(l + 0)),
      q = deconvertVU(a.charCodeAt(l + 1)),
      r = deconvertVU_comp((a.charCodeAt(l + 4) & 127) << 1),
      p = (a.charCodeAt(l + 4) & 128) != 0,

      // appData.vu["a." + g + ".mix"] = { pre: n, post: q };
      // store.commit('updateMixerData', { socketId: socketId, key: `vu.a.${g}.mix`, data: { pre: n, post: q } })
      vuData.push({ key: `vu.a.${g}.mix`, data: { pre: n, post: q } })
    }

    l = e += 5 * a.charCodeAt(4),
    n = deconvertVU(a.charCodeAt(l + 0)),
    q = deconvertVU(a.charCodeAt(l + 1)),
    r = deconvertVU_comp((a.charCodeAt(l + 4) & 127) << 1),
    p = (a.charCodeAt(l + 4) & 128) != 0,
    h = deconvertVU(a.charCodeAt(l + 5)),
    m = deconvertVU(a.charCodeAt(l + 6)),
    g = deconvertVU_comp((a.charCodeAt(l + 9) & 127) << 1)
    var t = (a.charCodeAt(l + 9) & 128) != 0
    // store.commit('updateMixerData', { socketId: socketId, key: 'vu.m.0.mix', data: { pre: n, post: q } })
    // store.commit('updateMixerData', { socketId: socketId, key: 'vu.m.1.mix', data: { pre: h, post: m } })
    vuData.push({ key: 'vu.m.0.mix', data: { pre: n, post: q } })
    vuData.push({ key: 'vu.m.1.mix', data: { pre: h, post: m } })
    // appData.vu["m.0.mix"] = { pre: n, post: q };
    // appData.vu["m.1.mix"] = { pre: h, post: m };

    l = e += 5 * a.charCodeAt(6)
    m = deconvertVU(a.charCodeAt(l + 0))
    n = deconvertVU(a.charCodeAt(l + 1))
    q = deconvertVU(a.charCodeAt(l + 2))
    r = deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1)
    p = (a.charCodeAt(l + 5) & 128) != 0

    // appData.vu["l.0.mix"] = { pre: n, post: q };

    l = e + 6
    m = deconvertVU(a.charCodeAt(l + 0))
    n = deconvertVU(a.charCodeAt(l + 1))
    q = deconvertVU(a.charCodeAt(l + 2))
    r = deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1)
    p = (a.charCodeAt(l + 5) & 128) != 0
    // appData.vu["l.1.mix"] = { pre: n, post: q };

    // app.updateVuStrips();
    store.commit('updateMixerDataVu', { socketId: socketId, vuData: vuData })
  }

  function deconvertVU (value) {
    return 0.004167508166392142 * value
  }

  function deconvertVU_comp (value) {
    // TODO: what is COMP_ZOOM and this function used for?
    const COMP_ZOOM = 2
    value = (1 - 0.004167508166392142 * (value | value >> 7 & 1)) * COMP_ZOOM
    value < 0.008 ? value = 0 : value > 1 && (value = 1)
    return value
  }
}

export default Ui24rMessageParser
