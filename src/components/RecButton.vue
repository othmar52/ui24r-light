<template>
  <button
    @click="toggleStateLocal"
    :class="`button button-rec button-${stateClass}`"
  >REC</button>
</template>

<script>
/* TODO: disable rec-button in case no usb-stick/harddisk is attached to the mixer */
import { mapGetters } from 'vuex'
export default {
  name: 'RecButton',
  props: {
    dataKeys: Array,
    socketId: String
  },
  data: function () {
    return {
      state: false
    }
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    remoteButtonState () {
      return this.readRemoteMixerValue({
        socketId: this.socketId,
        key: 'var.mtk.rec.currentState'
      })
    },
    stateClass () {
      return (this.state === true) ? 'active' : ''
    }
  },
  methods: {
    toggleStateLocal () {
      this.state = !this.state
      this.$store.dispatch('sendMixerCommand', {
        socketId: this.socketId,
        cmd: 'MTK_REC_TOGGLE'
      })
    }
  },
  watch: {
    remoteButtonState () {
      // console.log("watch.remoteButtonState() changed to ", this.remoteButtonState)
      this.state = (parseInt(this.remoteButtonState) === 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.button {
  z-index: 200;
  top: 2px;
  right: 2px;
  position: absolute;
}
.button {
  box-shadow:inset 0px 1px 0px 0px #ffffff;
  background:linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);
  background-color:#f9f9f9;
  border-radius:6px;
  border:1px solid #dcdcdc;
  display:inline-block;
  cursor:pointer;
  color:#666666;
  font-family:Arial;
  font-size:15px;
  font-weight:bold;
  padding:6px 24px;
  text-decoration:none;
  text-shadow:0px 1px 0px #ffffff;
}
.button-active {
  box-shadow:inset 0px 1px 0px 0px #f5978e;
  background:linear-gradient(to bottom, #f24537 5%, #c62d1f 100%);
  background-color:#f24537;
  border:1px solid #d02718;
  color:#ffffff;
}
.button:hover {
  background:linear-gradient(to bottom, #c62d1f 5%, #f24537 100%);
  background-color:#c62d1f;
}
.button:active {
}
</style>
