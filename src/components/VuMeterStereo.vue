<template>
  <div class="vumeter__stereo" >
    <VuMeter :keyVu="'vu.' + keyVuLeft" :socketId="socketId" />
    <VuMeter :keyVu="'vu.' + keyVuRight" :socketId="socketId" />
  </div>
</template>

<script>
import VuMeter from './VuMeter.vue'
export default {
  name: 'VuMeterStereo',
  components: {
    VuMeter
  },
  props: {
    keyVuLeft: String,
    keyVuRight: String,
    socketId: String
  }
}
</script>
