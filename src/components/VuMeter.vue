<template>
  <div class="vumeter" >
    <div class="vumeter__in" :style="`height: ${vuInPercent}%;`"></div>
    <div class="vumeter__out" :style="`height: ${vuOutPercent}%;`"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VuMeter',
  props: {
    keyVu: String,
    socketId: String
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    vuInPercent () {
      return this.getVuPercent(this.keyVu, 'pre')
    },
    vuOutPercent () {
      return this.getVuPercent(this.keyVu, 'post')
    }
  },
  methods: {
    getVuPercent (vuKey, subKey) {
      const vuValue = this.readRemoteMixerValue({
        socketId: this.socketId,
        key: vuKey
      })
      // console.log(vuValue)
      if (typeof vuValue === 'undefined') {
        return 0
      }
      return (vuValue[subKey] < 1)
        ? vuValue[subKey] * 100 /* * this.$store.getters.getCurSetup(this.socketId).zeroDbPos */
        : 100
    }
  }
}
</script>
