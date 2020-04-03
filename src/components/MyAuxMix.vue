<template>
  <div class="slider__container">
    <!-- headphone(aux) volume -->
    <RangeSliderVu :socketId="socketId" :dataKeys="auxDataKeys" additionalClass="auxvolume"/>

    <!-- single fader for group (all others) in headphone(aux) mix -->
    <div class="range__slider-group">
        <RangeSliderGroupMix :socketId="socketId" staticLabel="group" :myInputChannels="myInputChannels" :myAuxChannel="myAuxChannel"/>
    </div>

    <!-- levels of myChannels for headphone(aux) mix -->
    <RangeSliderVu
        v-for="(item, index) in inputDataKeysAuxMix"
        v-bind:dataKeys="item"
        v-bind:key="index"
        :socketId="socketId"
    ></RangeSliderVu>

    <!-- levels of myChannels for master mix -->
    <RangeSliderVu
        v-for="(item, index) in inputDataKeysMasterMix"
        v-bind:dataKeys="item"
        v-bind:key="index+100"
        :socketId="socketId"
    ></RangeSliderVu>
  </div>
</template>

<script>
import RangeSliderVu from './RangeSliderVu.vue'
import RangeSliderGroupMix from './RangeSliderGroupMix.vue'
export default {
  name: 'MyAuxMix',
  components: {
    RangeSliderVu,
    RangeSliderGroupMix
  },
  // props: {
  //   myInputChannels: Array,
  //   myAuxChannel: Array
  // },
  computed: {
    myAuxChannel () {
      // :myInputChannels="[[2,3],[7]]" :myAuxChannel="[0,1]"
      return this.$route.params.myAuxChannel
    },
    myInputChannels () {
      // :myInputChannels="[[2,3],[7]]" :myAuxChannel="[0,1]"
      return this.$route.params.myInputChannels
    },
    socketId () {
      return this.$route.params.socketId
    },
    auxDataKeys () {
      const keys = []
      for (const index in this.myAuxChannel) {
        keys.push(`a.${index}.mix`)
      }
      return keys
    },
    inputDataKeysAuxMix () {
      const allSources = []
      for (const inputSources of this.myInputChannels) {
        const singleSource = []
        for (const channelIndex of inputSources) {
          for (const auxIndex of this.myAuxChannel) {
            singleSource.push(`i.${channelIndex}.aux.${auxIndex}.value`)
          }
        }
        allSources.push(singleSource)
      }
      console.log('inputDataKeysAuxMix', allSources)
      return allSources
    },
    inputDataKeysMasterMix () {
      const allSources = []
      for (const inputSources of this.myInputChannels) {
        const singleSource = []
        for (const channelIndex of inputSources) {
          singleSource.push(`i.${channelIndex}.mix`)
        }
        allSources.push(singleSource)
      }
      console.log('inputDataKeysMasterMix', allSources)
      return allSources
    }
  },
  mounted () {
    // this.myInputChannels = [[2, 3], [7]]
    // this.myAuxChannel = [0, 1]
    // console.log('mounted MyAuXMix.vue', this.socketId)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.slider__container {
  display: flex;
  height: 80vh;
}

.range__slider-group {
  display: flex;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
}

.auxvolume {
    max-width: 3em;
}

</style>
