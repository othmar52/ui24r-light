<template>
  <div v-if="socketEnabled(socketId)" :class="`indicator indicator-${indicatorClass}`"></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ConnectionStatus',
  props: {
    socketId: String
  },
  computed: {
    ...mapGetters({
      socketConnected: 'socketConnected',
      socketEnabled: 'socketEnabled'
    }),
    indicatorClass () {
      return this.socketConnected(this.socketId) ? 'green' : 'red'
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
</style>
