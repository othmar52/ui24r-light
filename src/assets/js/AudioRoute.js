const AudioRoute = {
  id: undefined,
  from: {
    input: undefined,
    muted: false,
    toHeadphones: false
  },
  targetChain: [],
  removeFromTargetChain: undefined,
  addToTargetChain: undefined,
  over: [], // remove "over"
  to: { // remove "to"
    output: undefined,
    type: undefined,
    level: 0.5,
    fx1: false,
    fx2: false,
    fx3: false,
    fx4: false
  },
  getFinalTargetChannel: function () {
    return 'ff'
  },
  getFinalTargetType: function () {
    return 'output'
  }
}

export default AudioRoute
