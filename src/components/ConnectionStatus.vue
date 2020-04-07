<template>
  <div v-if="socketEnabled(socketId)" :class="`indicator indicator-${indicatorClass} indicator-${armedStateClass}`"></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ConnectionStatus',
  props: {
    socketId: String
  },
  data: function () {
    return {
      armedState: false
    }
  },
  computed: {
    ...mapGetters({
      socketConnected: 'socketConnected',
      socketEnabled: 'socketEnabled',
      readRemoteMixerValue: 'readRemoteMixerValue'
    }),
    indicatorClass () {
      return this.socketConnected(this.socketId) ? 'green' : 'red'
    },
    remoteArmedState () {
      if (this.socketId === 'mixer1' || this.socketId === 'mixer2') {
        // not available for mixer sockets but only for paramRecorder sockets
        return ''
      }
      return this.readRemoteMixerValue({
        socketId: this.socketId,
        key: 'armed'
      })
    },
    armedStateClass () {
      if (this.socketId === 'mixer1' || this.socketId === 'mixer2') {
        // not available for mixer sockets but only for paramRecorder sockets
        return ''
      }
      return (this.armedState === true) ? 'armed' : 'unarmed'
    }
  },
  watch: {
    remoteArmedState () {
      this.armedState = this.remoteArmedState
    }
  }
}
</script>
<style>
.indicator {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: red;
}

.indicator-green {
    background-color: #5cb85c;
}

.indicator-armed {
    border: 3px solid red;
}
</style>
