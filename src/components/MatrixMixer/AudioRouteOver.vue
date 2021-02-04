<template>
  <div :class="`audioroute__over ${overActiveForRoute ? '' : 'bypassed'}`">
    <span class="arrow">&#10145;</span>
    <div @click="toggleBypassOver" class="vcenter">
      <InputWithVu :item="overItem" v-if="overActiveForRoute"/>
      <div v-else>{{overItem.name}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
export default {
  name: 'AudioRouteOver',
  components: {
    InputWithVu
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
.audioroute__over {
  display: flex;
  padding: 0 20px;
  flex-grow: 1;
  flex-shrink: 1;
  &.bypassed {
    opacity: 0.2;
  }
}
</style>
