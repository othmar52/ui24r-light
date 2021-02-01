<template>
  <div class="audioroute__output">
    <div v-if="!wizardOpen" @click="showOutputSelectorWizard">
      <OutputWithVu :item="routeOutput"  v-if="routeOutput" />
      <div v-else>no output defined</div>
    </div>
    <div v-else class="matrixconf__wizard matrixconf__wizard--output">
      select output target for audio route
      <div class="matrixconf__outputs">
        <div v-for="(item, index) in getEnabledMatrixOutputs" v-bind:key="index+100">
          <div
            @click="chooseOutput"
            :data-channels="item.outputChannels">
            <OutputWithVu :item="item" />
          </div>
        </div>
      </div>
      <div @click="chooseOutput">cancel</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OutputWithVu from '@/components/MatrixMixer/OutputWithVu.vue'
export default {
  name: 'AudioRouteOutput',
  components: {
    OutputWithVu
  },
  props: {
    routeOutput: {
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
      'getEnabledMatrixOutputs'
    ])
  },
  methods: {
    showOutputSelectorWizard () {
      // if we have only 1 enabled output we can simply toggle
      if (this.getEnabledMatrixOutputs.length > 1) {
        this.wizardOpen = true
        return
      }
      if (this.getEnabledMatrixOutputs.length < 1) {
        // invalid configuration
        return
      }
      this.$emit(
        'setRouteOutput',
        (this.routeOutput) ? undefined : this.getEnabledMatrixOutputs[0]
      )
    },
    chooseOutput (event) {
      this.wizardOpen = false
      for (const item of this.getEnabledMatrixOutputs) {
        if (event.currentTarget.dataset.channels !== item.outputChannels.join(',')) {
          continue
        }
        this.$emit('setRouteOutput', item)
        return
      }
      this.$emit('setRouteOutput', undefined)
    }
  },
  created () {
    // console.log('created Output', this.$store.state.matrixOvers)
    // this.route.over = this.$store.state.matrixOvers
  },
  mounted () {
    // console.log('mounted Output', this.$store.state.matrixOvers)
    // this.route.over = this.$store.state.matrixOvers
  }
}
</script>

<style lang="scss">
.matrixconf__wizard {
  .matrixconf__outputs {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
