<template>
  <div class="audioroute__output">
    <div @click="showOutputSelectorWizard">
      <div class="centered__flex" v-if="routeOutput" >
        <span class="arrow">&#10145;</span>
        <OutputWithVu :item="routeOutput" />
      </div>
      <div v-else class="unrouted">
        <span class="arrow arrow--hidden">&#10145;</span>
        no output
      </div>
    </div>
    <div v-if="wizardOpen" class="matrixconf__wizard matrixconf__wizard--output">
      <div class="matrixconf__outputs">
        <div v-for="(item, index) in getEnabledMatrixOutputs" v-bind:key="index+100">
          <div
            @click="chooseOutput"
            :data-channels="item.id">
            <OutputWithVu :item="item" />
          </div>
        </div>
        <div>
          <div
            class="vuued__channel vuued__channel--disabledvu"
            @click="removeRouteTarget"
            :data-channels="undefined">
            <span class="color-9">
            NO OUTPUT
            </span>
          </div>
        </div>
        <div>
          <div @click="cancelWizard">cancel</div>
        </div>
      </div>
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
      // console.log('currentOutput before chooseOutput 1', this.routeOutput)
      this.$emit(
        (this.routeOutput) ? 'removeRouteTarget' : 'addRouteTarget',
        (this.routeOutput) ? this.routeOutput : this.getEnabledMatrixOutputs[0]
      )
    },
    chooseOutput (event) {
      this.wizardOpen = false
      const newOutput = this.getEnabledMatrixOutputs.filter(function (item) {
        return event.currentTarget.dataset.channels === item.id
      })
      // console.log('the new output is:', newOutput[0])
      this.$emit('addRouteTarget', newOutput[0])
    },
    removeRouteTarget () {
      this.wizardOpen = false
      if (typeof this.routeOutput === 'undefined') {
        return
      }
      this.$emit('removeRouteTarget', this.routeOutput)
    },
    cancelWizard (event) {
      this.wizardOpen = false
    }
  }
}
</script>
