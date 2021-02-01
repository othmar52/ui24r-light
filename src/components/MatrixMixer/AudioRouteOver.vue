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
  data () {
    return {
      /*
      route: this.$store.state.matrixRoutes.filter(function (item) {
        return item.id === this.routeId
      })[0]
      */
    }
  },
  computed: {
    ...mapGetters([
      'getEnabledMatrixOvers',
      'getRouteById'
    ]),
    overActiveForRoute () {
      // console.log(this.getRouteById(this.routeId))
      const that = this
      return this.getRouteById(this.routeId).over.filter(function (item) {
        return item.inputChannels.join(',') === that.overItem.inputChannels.join(',')
      }).length > 0
    }
  },
  methods: {
    showInputSelectorWizard () {
      this.wizardOpen = true
    },
    toggleBypassOver () {
      this.$emit('toggleBypassOver', this.overItem)
    }
  },
  created () {
    // console.log('created input', this.$store.state.matrixOvers)
    // this.route.over = this.$store.state.matrixOvers
  },
  mounted () {
    // console.log('mounted input', this.$store.state.matrixOvers)
    // this.route.over = this.$store.state.matrixOvers
  }
}
</script>

<style lang="scss">
.audioroute__over {
  display: flex;
  padding: 0 20px;
  &.bypassed {
    opacity: 0.2;
  }
}
</style>
