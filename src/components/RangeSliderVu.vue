<template>
  <div class="range__slider-vu" :class="additionalClass">
    <VuMeter :keyVu="`vu.${dataKeys[0]}`" v-if="dataKeys.length === 1" />
    <VuMeterStereo :keyVuLeft="`${dataKeys[0]}`" :keyVuRight="dataKeys[1]" v-else/>
    <RangeSlider :dataKeys="dataKeys" labelKey="i.1.name"/>
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
        dataKeys: Array,
        additionalClass: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.range__slider-vu {
  display: flex;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
}

.range__slider-vu .range-slider {
  width: 80%;
}
.range__slider-vu .vumeter__stereo,
.range__slider-vu>.vumeter {
  width: 20%;
}
</style>
