<template>
    <div class="range-slider" ref="sliderWrapper">
        <input type="range" orient="vertical" min="0" step="0.01" max="1" v-model="localSliderValue" />
        <div :class="`range-slider__bar range-slider__bar--color-5`" :style="{'height': barHeight}"></div>
        <div class="range-slider__thumb" :style="{'bottom': thumbBottom}" ref="thumb"></div>
        <StripLabel :socketId="socketId" :staticText="staticLabel" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StripLabel from './StripLabel.vue'
export default {
  name: 'RangeSliderGroupMix',
  components: {
    StripLabel
  },
  data: function () {
    return {
      localSliderValue: 0,
      visualSliderValue: 0,
      barHeight: 0,
      thumbBottom: 0
    }
  },
  props: {
    myInputChannels: Array,
    myAuxChannel: Array,
    dataKeys: Array,
    labelKey: String,
    staticLabel: String
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    socketId () {
      return this.$route.params.socketId
    },
    remoteSliderValue () {
      // concatenate all relevant values that affect the headphone mix
      let paramChunk = ''
      // we have to observe all "non-my"-channels and their mute states as well
      for (const inputIndex of [...Array(this.$store.getters.getCurSetup(this.socketId).input)].keys()) {
        if (this.isMyInput(inputIndex)) {
          // skip channels that has theeir own sliders in gui
          continue
        }
        paramChunk += `-i.${inputIndex}.mix-` + this.readSpecificRemoteMixerValue(`i.${inputIndex}.mix`)
        paramChunk += `-i.${inputIndex}.mute-` + this.readSpecificRemoteMixerValue(`i.${inputIndex}.mute`)
      }
      return paramChunk
    }

  },
  methods: {
    readSpecificRemoteMixerValue (keyArg) {
      return this.readRemoteMixerValue({ socketId: this.socketId, key: keyArg })
    },
    setVisualSliderValue (newValue) {
      this.visualSliderValue = newValue
      this.thumbBottom = this.getHeightPercent() + '%'
      this.barHeight = `calc(${this.getHeightPercent()}% + ${this.$refs.thumb.clientHeight / 2}px)`
    },
    getHeightPercent () {
      return this.visualSliderValue * 100 * (
        (this.$refs.sliderWrapper.clientHeight - this.$refs.thumb.clientHeight) / this.$refs.sliderWrapper.clientHeight
      )
    },
    isMyInput (inputIndex) {
      for (const inputSources of this.myInputChannels) {
        for (const channelIndex of inputSources) {
          if (channelIndex === inputIndex) {
            return true
          }
        }
      }
      return false
    },
    applyMyAuxMix () {
      for (const inputIndex of [...Array(this.$store.getters.getCurSetup(this.socketId).input)].keys()) {
        if (this.isMyInput(inputIndex)) {
          // skip channels that has their own sliders in gui
          continue
        }

        const factor = this.localSliderValue / (this.$store.getters.getCurSetup(this.socketId).zeroDbPos / 100) / 100
        const otherInput2MasterLevel = this.readSpecificRemoteMixerValue(`i.${inputIndex}.mix`)
        let auxLevelForMyMix = otherInput2MasterLevel * factor;
        (auxLevelForMyMix > 1) && (auxLevelForMyMix = 1);
        (this.readSpecificRemoteMixerValue(`i.${inputIndex}.mute`) === 1) && (auxLevelForMyMix = 0)

        // apply levels to either mono or both stereo aux channel
        for (const auxIndex of this.myAuxChannel) {
          this.$store.dispatch('sendMixerParam', {
            socketId: this.socketId,
            mKey: `i.${inputIndex}.aux.${auxIndex}.value`,
            mValue: parseFloat(auxLevelForMyMix)
          })
        }
      }
    }
  },
  mounted () {
    this.localSliderValue = this.$store.getters.getCurSetup(this.socketId).zeroDbPos
    this.setVisualSliderValue(this.$store.getters.getCurSetup(this.socketId).zeroDbPos)
  },
  watch: {
    localSliderValue () {
      // console.log("watch.localSliderValue() changed to ", this.localSliderValue)
      this.setVisualSliderValue(this.localSliderValue)
      this.applyMyAuxMix()
    },
    remoteSliderValue () {
      // console.log("watch.remoteSliderValue() changed to ", this.remoteSliderValue)
      this.applyMyAuxMix()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
