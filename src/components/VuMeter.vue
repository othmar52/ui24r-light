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
      const vuValue = this.readRemoteMixerValue({ socketId: this.socketId, key: vuKey })
      if (typeof vuValue === 'undefined') { return 0 }

      return (vuValue[subKey] < 1)
        ? vuValue[subKey] * 100 /* * this.$store.getters.getCurSetup(this.socketId).zeroDbPos */
        : 100
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.vumeter {
   position: relative;
   height: 100%;
   width: 100%;
   background: #343440;
}

.vumeter__in,
.vumeter__out {
  width: 100%;
  height: 0;
  position: absolute;
  bottom: 0;
}

.vumeter__in {
  background: #2e2e3a;
}
.vumeter__out {
  /* background: #777; */
  /* TODO how to make the gradient height independent? */

  background: linear-gradient(to bottom, #ff1209,  #ff1209, #fd7d2e, #eef609, #10880a, #10880a, #10880a);
  background-attachment: fixed;
}
</style>
