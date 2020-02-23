<template>
  <div class="range-slider" ref="sliderWrapper">
    <input
      type="range"
      orient="vertical"
      min="0"
      step="0.01"
      max="1"
      v-model="localSliderValue"
    />
    <div :class="`range-slider__bar range-slider__bar--color-${readRemoteColorIndex}`" :style="{'height': barHeight}"></div>
    <div class="range-slider__thumb" :style="{'bottom': thumbBottom}" ref="thumb"></div>
    <StripLabel :staticText="staticLabel" :labelKey="stripLabelKey" v-if="labelKey || staticLabel" />
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
import StripLabel from './StripLabel.vue'
export default {
  name: 'RangeSlider',
    components: {
      StripLabel
    },
  data: function(){
    return {
      localSliderValue: 0,
      visualSliderValue: 0,
      barHeight: 0,
      thumbBottom: 0
    }
  },
  props: {
    dataKeys: Array,
    labelKey: String,
    staticLabel: String
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    remoteSliderValue() {
      return this.readRemoteMixerValue(this.dataKeys[0]);
    },
    stripLabelKey() {
      let found = this.dataKeys[0].match(/([ia].*)\.(\d.*)\./)
      if(found) {
        //console.log(found);
        return `${found[1]}.${found[2]}.name`
      }
      return undefined
    },
    readRemoteColorIndex() {
      let found = this.dataKeys[0].match(/i\.(\d.*)\./)
      if(found) {
        return this.readRemoteMixerValue(`i.${found[1]}.color`);
      }
      return undefined
    }

  },
  methods: {
     setVisualSliderValue(newValue) {
       this.visualSliderValue = newValue;
       this.thumbBottom = this.getHeightPercent() + '%';
       this.barHeight = `calc(${this.getHeightPercent()}% + ${this.$refs.thumb.clientHeight / 2}px)`;
     },
     getHeightPercent() {
       return this.visualSliderValue * 100 * (
         (this.$refs.sliderWrapper.clientHeight - this.$refs.thumb.clientHeight) / this.$refs.sliderWrapper.clientHeight
      );
     }
  },
  watch: {
    localSliderValue(){
      //console.log("watch.localSliderValue() changed to ", this.localSliderValue)
      this.$store.dispatch('sendMixerParam', {
        mKey: this.dataKeys[0],
        mValue: parseFloat(this.localSliderValue)
      })
      this.setVisualSliderValue(this.localSliderValue)

      // set value for linked stereo channel as well?
      if((typeof this.dataKeys[1]) !== 'string') {
        return
      }
      this.$store.dispatch('sendMixerParam', {
        mKey: this.dataKeys[1],
        mValue: parseFloat(this.localSliderValue)
      })
    },
    remoteSliderValue(){
      //console.log("watch.remoteSliderValue() changed to ", this.remoteSliderValue)
      this.setVisualSliderValue(this.remoteSliderValue)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .range-slider {
    display: inline-block;
    width: 100%;
    position: relative;
    text-align: center;
    height: 100%;
    flex-grow: 1;
    flex-shrink: 1;
  }
  .range-slider__thumb {
    position: absolute;
    left: 0;
    width: 100%;
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
    width: 100%;
    left: 0;
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
    width: 100%;
    left: 0;
    border-color: #343440;
    border-radius: 0.5em;
    box-shadow: 0 0 0 2px #3D3D4A;
  }
  .range-slider input[type=range][orient=vertical]::-moz-range-track {
    border: none;
    background: #343440;
    width: 100%;
    border-color: #343440;
    border-radius: 0.5em;
    box-shadow: 0 0 0 2px #3D3D4A;
  }
  .range-slider input[type=range][orient=vertical]::-ms-track {
    border: none;
    background: #343440;
    width: 100%;
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
    width: 100%;
    height: 30px;
    opacity: 0;
  }
  .range-slider input[type=range][orient=vertical]::-moz-range-thumb {
    width: 100%;
    height: 30px;
    opacity: 0;
  }
  .range-slider input[type=range][orient=vertical]::-ms-thumb {
    width: 100%;
    height: 30px;
    opacity: 0;
  }
  /* 1-11 are ui24r's colors, 12-15 are custom script extended colors */
  .range-slider__bar--color-1 { background: linear-gradient(#111111, #111111); }
  .range-slider__bar--color-2 { background: linear-gradient(#8B0000, #8B0000); }
  .range-slider__bar--color-3 { background: linear-gradient(#FF0000, #9e0303); } /* red */
  .range-slider__bar--color-4 { background: linear-gradient(#FFA500, #FFA500); }
  .range-slider__bar--color-5 { background: linear-gradient(#FFFF00, #9a9a02); } /* yellow */
  .range-slider__bar--color-6 { background: linear-gradient(#56DE43, #25641c); } /* green */
  .range-slider__bar--color-7 { background: linear-gradient(#0091C2, #005673); } /* lightblue */
  .range-slider__bar--color-8 { background: linear-gradient(#9400D3, #9400D3); }
  .range-slider__bar--color-9 { background: linear-gradient(#808080, #808080); }
  .range-slider__bar--color-10 { background: linear-gradient(#FFFFFF, #FFFFFF); }
  .range-slider__bar--color-11 { background: linear-gradient(#FF1493, #FF1493); }
  .range-slider__bar--color-12 { background: linear-gradient(#00FFFF, #00FFFF); }
  .range-slider__bar--color-13 { background: linear-gradient(#009688, #009688); }
  .range-slider__bar--color-14 { background: linear-gradient(#3a4caf, #3a4caf); }
  .range-slider__bar--color-15 { background: linear-gradient(#966100, #482f00); } /* brown */
  
</style>
