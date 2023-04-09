<template>
  <div class="slider__container">
    <RecButton v-if="showRec" :socketId="socketId" />
    <!-- headphone(aux) volume -->
    <RangeSliderVu
      :socketId="socketId"
      :dataKeys="auxDataKeys"
      additionalClass="auxvolume"
    />

    <!-- single fader for group (all others) in headphone(aux) mix -->
    <div class="range__slider-group">
      <RangeSliderGroupMix
        :socketId="socketId"
        staticLabel="group"
        :myInputChannels="myInputChannels"
        :myAuxChannel="myAuxChannel"
      />
    </div>

    <!-- levels of myChannels for headphone(aux) mix -->
    <RangeSliderVu
      v-for="(item, index) in inputDataKeysAuxMix"
      v-bind:dataKeys="item"
      v-bind:key="index"
      :socketId="socketId"
    />

    <!-- levels of myChannels for master mix -->
    <RangeSliderVu
      v-for="(item, index) in inputDataKeysMasterMix"
      v-bind:dataKeys="item"
      v-bind:key="index+100"
      :socketId="socketId"
    />
  </div>
</template>

<script>
import RangeSliderVu from '@/components/RangeSliderVu.vue'
import RangeSliderGroupMix from '@/components/RangeSliderGroupMix.vue'
import RecButton from '@/components/RecButton.vue'
import NoSleep from 'nosleep.js'
export default {
  name: 'MyAuxMix',
  components: {
    RangeSliderVu,
    RangeSliderGroupMix,
    RecButton
  },
  props: {
    myInputChannels: Array,
    myAuxChannel: Array,
    socketId: String,
    showRec: Boolean,
    noSleep: Boolean
  },
  computed: {
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
      return allSources
    }
  },
  mounted () {
    var noSleep = new NoSleep()
    // Enable wake lock.
    // (must be wrapped in a user input event handler e.g. a mouse or touch handler)
    document.addEventListener('click', function enableNoSleep () {
      document.removeEventListener('click', enableNoSleep, false)
      noSleep.enable()
    }, false)
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
