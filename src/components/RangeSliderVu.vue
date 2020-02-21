<template>
  <div class="range__slider-vu">
    <VuMeter :keyVu="`vu.${dataKeys[0]}`" v-if="dataKeys.length === 1" />
    <VuMeterStereo :keyVuLeft="`${dataKeys[0]}`" :keyVuRight="dataKeys[1]" v-else/>
    <RangeSlider :dataKeys="dataKeys" />
  </div>
</template>

<script>
import RangeSlider from './RangeSlider.vue'
import VuMeter from './VuMeter.vue'
import VuMeterStereo from './VuMeterStereo.vue'
export default {
    name: 'RangeSliderVu',
    components: {
        VuMeter,
        VuMeterStereo,
        RangeSlider
    },
    props: {
        dataKeys: Array
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.range__slider-vu {
  display: flex;
  border: 1px solid green;
  height: 300px;
}
</style>
