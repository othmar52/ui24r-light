<template>
  <div class="audioroute__input centeXXXred__flex">
    <div @click="toggleInputSelectorWizard" class="centered__flex">
      <span class="arrow arrow--hidden">&#10145;</span>
      <div v-if="routeInput" >
        <InputWithVu :item="routeInput"/>
      </div>
      <div v-else class="unrouted">
        no input
      </div>
    </div>
    <div v-if="wizardOpen" class="matrixconf__wizard matrixconf__wizard--input">
      <div class="matrixconf__inputs">
        <div v-for="(item, index) in getAvailableMatrixInputs" v-bind:key="index+100">
          <div
            @click="chooseInput"
            :data-channels="item.inputChannels">
            <InputWithVu :item="item" />
          </div>
        </div>
        <div>
          <div
            class="vuued__channel"
            @click="chooseInput"
            :data-channels="undefined">
            <span class="color-9">
            NO INPUT
            </span>
          </div>
        </div>
      </div>
      <div @click="cancelWizard">cancel</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
export default {
  name: 'AudioRouteInput',
  components: {
    InputWithVu
  },
  props: {
    routeInput: {
      type: Object,
      default: function () {
        return undefined
      }
    }
  },
  data () {
    return {
      wizardOpen: false
    }
  },
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getEnabledMatrixInputs',
      'getUnroutedMatrixInputs',
      'getMatrixHelperEnabled'
    ]),
    getAvailableMatrixInputs () {
      return (this.getMatrixHelperEnabled === true)
        ? this.getUnroutedMatrixInputs
        : this.getEnabledMatrixInputs
    }
  },
  methods: {
    toggleInputSelectorWizard () {
      this.wizardOpen = !this.wizardOpen
    },
    chooseInput (event) {
      this.wizardOpen = false
      for (const item of this.getMatrixInputs) {
        if (event.currentTarget.dataset.channels !== item.inputChannels.join(',')) {
          continue
        }
        this.$emit('setRouteInput', item)
        return
      }
      this.$emit('setRouteInput', undefined)
    },
    cancelWizard (event) {
      this.wizardOpen = false
    }
  }
}
</script>

<style lang="scss">

</style>
