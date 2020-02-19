<template>
  <div class="range-slider" data-key="a.2.mix" data-key2="null" data-slider-value="0" ref="sliderWrapper">
    <input
      type="range"
      orient="vertical"
      min="0"
      max="100"
      v-model="sliderValue"
    />
    <div class="range-slider__bar" :style="{'height': barHeight}"></div>
    <div class="range-slider__thumb" :style="{'bottom': thumbBottom}" ref="thumb"></div>
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
export default {
  name: 'RangeSlider',
  data: function(){
    return {
      sliderValue: 0,
      barHeight: 0,
      thumbBottom: 0
    }
  },
  props: {
    dataKey: String
  },
  computed: {
    ...mapGetters({
      'mixerValue': 'getMixerValue'
    }),

  },
  methods: {
     getHeightPercent() {
       return this.sliderValue * (
         (this.$refs.sliderWrapper.clientHeight - this.$refs.thumb.clientHeight) / this.$refs.sliderWrapper.clientHeight
      );
     }
  },
  watch: {
    sliderValue(newValue){
      this.thumbBottom = this.getHeightPercent() + '%';
      this.barHeight = `calc(${this.getHeightPercent()}% + ${this.$refs.thumb.clientHeight / 2}px)`  + '%';
      //console.log(newValue)
    }
    /*,
    mixerValue(newValue){
      this.thumbHeight = '20%';
      console.log(newValue)
    }
    */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .range-slider {
    display: inline-block;
    width: 100%;
    position: relative;
    text-align: center;
    height: 100%;
    max-height: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 10px;
    max-width: 100px;
  }
  .range-slider:before {
    position: absolute;
    top: -2em;
    left: .5em;
    content: attr(data-slider-db);
    color: white;
    font-size: 50%;
    text-align: center;
  }
  .range-slider__thumb {
    position: absolute;
    left: 10%;
    width: 90%;
    height: 30px;
    line-height: 30px;
    background: white;
    color: #777;
    font-size: 50%;
    box-shadow: 0 0 0 4px #3D3D4A;
    border-radius: 0.5em;
    border-radius: 0.5em;
    pointer-events: none;
  }
  .range-slider__bar {
    left: 16px;
    bottom: 0;
    position: absolute;
    background: linear-gradient(dodgerblue, blue);
    pointer-events: none;
    width: 90%;
    left: 10%;
    border-radius: 0.5em;
  }
  .range-slider input[type=range][orient=vertical] {
    position: relative;
    margin: 0;
    height: 100%;
    width: 100%;
    display: inline-block;
    position: relative;
    writing-mode: bt-lr;
    -webkit-appearance: slider-vertical;
  }
  .range-slider input[type=range][orient=vertical]::-webkit-slider-runnable-track,
  .range-slider input[type=range][orient=vertical]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  .range-slider input[type=range][orient=vertical]::-webkit-slider-runnable-track {
    border: none;
    position: relative;
    background: #343440;
    width: 90%;
    left: 5%;
    border-color: #343440;
    border-radius: 0.5em;
    box-shadow: 0 0 0 2px #3D3D4A;
  }
  .range-slider input[type=range][orient=vertical]::-moz-range-track {
    border: none;
    background: #343440;
    width: 90%;
    border-color: #343440;
    border-radius: 0.5em;
    box-shadow: 0 0 0 2px #3D3D4A;
  }
  .range-slider input[type=range][orient=vertical]::-ms-track {
    border: none;
    background: #343440;
    width: 90%;
    border-color: #343440;
    border-radius: 0.5em;
    box-shadow: 0 0 0 2px #3D3D4A;
    color: transparent;
    height: 100%;
  }
  .range-slider input[type=range][orient=vertical]::-ms-fill-lower,
  .range-slider input[type=range][orient=vertical]::-ms-fill-upper,
  .range-slider input[type=range][orient=vertical]::-ms-tooltip {
    display: none;
  }
  .range-slider input[type=range][orient=vertical]::-webkit-slider-thumb {
    width: 90%;
    height: 30px;
    opacity: 0;
  }
  .range-slider input[type=range][orient=vertical]::-moz-range-thumb {
    width: 90%;
    height: 30px;
    opacity: 0;
  }
  .range-slider input[type=range][orient=vertical]::-ms-thumb {
    width: 90%;
    height: 30px;
    opacity: 0;
  }
  
</style>
