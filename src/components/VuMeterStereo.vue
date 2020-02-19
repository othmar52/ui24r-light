<template>
  <div class="vumeter__stereo" >
    <VuMeter :keyVu="'vu.' + keyVuLeft"/>
    <VuMeter :keyVu="'vu.' + keyVuRight"/>
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
    keyVuRight: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
