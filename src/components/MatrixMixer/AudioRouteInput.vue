<template>
  <div class="audioroute__input">
    <div v-if="!wizardOpen" @click="showInputSelectorWizard">
      <InputWithVu :item="routeInput"  v-if="routeInput" />
      <div v-else>no input defined</div>
    </div>
    <div v-else class="matrixconf__wizard matrixconf__wizard--input">
      select input source for audio route
      <div class="matrixconf__inputs">
        <div v-for="(item, index) in getUnroutedMatrixInputs" v-bind:key="index+100">
          <div
            @click="chooseInput"
            :data-channels="item.inputChannels">
            <InputWithVu :item="item" />
          </div>
        </div>
      </div>
      <div @click="chooseInput">cancel</div>
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
      'getUnroutedMatrixInputs'
    ])
  },
  methods: {
    showInputSelectorWizard () {
      this.wizardOpen = true
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
    }
  }
}
</script>

<style lang="scss">
.matrixconf__wizard {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background: black;
  padding: 20px;
  z-index: 10000;
  .matrixconf__inputs {
    display: flex;
    flex-wrap: wrap;

  }
}
</style>
