<template>
  <div :class="`audioroute__over centered__flex ${overActiveForRoute ? '' : 'bypassed'}`">
    <AudioRouteOverMover :overItem="overItem" />
    <div @click="toggleBypassOver" class="vcenter">
      <InputWithVu :item="overItem" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
import AudioRouteOverMover from '@/components/MatrixMixer/AudioRouteOverMover.vue'
export default {
  name: 'AudioRouteOver',
  components: {
    InputWithVu,
    AudioRouteOverMover
  },
  props: {
    routeId: Number,
    overItem: Object
  },
  computed: {
    ...mapGetters([
      'getRouteById',
      'getTargetChainById'
    ]),
    overActiveForRoute () {
      if (typeof this.routeId === 'undefined') {
        return false
      }
      const route = this.getRouteById(this.routeId)
      const currentTargets = this.getTargetChainById(route.targetChainId)
      if (typeof currentTargets === 'undefined') {
        return false
      }
      const that = this
      return currentTargets.chain.filter(function (item) {
        return item.id === that.overItem.id
      }).length > 0
    }
  },
  methods: {
    showInputSelectorWizard () {
      this.wizardOpen = true
    },
    toggleBypassOver () {
      this.$emit(
        (this.overActiveForRoute) ? 'removeRouteTarget' : 'addRouteTarget',
        this.overItem
      )
    }
  }
}
</script>

<style lang="scss">

</style>
