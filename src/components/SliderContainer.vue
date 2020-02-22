<template>
  <div class="slider__container">
    <RangeSliderVu
        v-for="(item, index) in rangeSlidersVu"
        v-bind:dataKeys="item"
        v-bind:key="index"
    ></RangeSliderVu>
  </div>
</template>

<script>
import RangeSliderVu from './RangeSliderVu.vue'
export default {
    name: 'SliderContainer',
    components: {
        RangeSliderVu
    },
    props: {
        rangeSlidersVu: Array
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.slider__container {
  display: flex;
  height: 80vh;
}
</style>
