<template>
  <div class="audioroute__overs">
    <AudioRouteOver
      v-for="(overItem, overIndex) in getEnabledMatrixOvers"
      v-bind:key="overIndex+100"
      :routeId="routeId"
      :overItem="overItem"
      v-on:toggleBypassOver="toggleBypassOver"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRouteOver from '@/components/MatrixMixer/AudioRouteOver.vue'
export default {
  name: 'AudioRouteOverChain',
  components: {
    AudioRouteOver
  },
  props: {
    routeId: Number
  },
  data () {
    return {
      wizardOpenXXXXXXXXXX: false
    }
  },
  computed: {
    ...mapGetters([
      'getEnabledMatrixOvers'
    ])
  },
  methods: {
    toggleBypassOver (payload) {
      this.$emit('toggleBypassOver', payload)
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
.audioroute__overs {
  display: flex;
}
</style>
