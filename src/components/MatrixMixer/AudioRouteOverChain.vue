<template>
  <div class="audioroute__overs">
    <AudioRouteOver
      v-for="(overItem, overIndex) in getEnabledMatrixOvers"
      v-bind:key="overIndex+100"
      :routeId="routeId"
      :overItem="overItem"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
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
  computed: {
    ...mapGetters([
      'getEnabledMatrixOvers'
    ])
  },
  methods: {
    addRouteTarget (payload) {
      this.$emit('addRouteTarget', payload)
    },
    removeRouteTarget (payload) {
      this.$emit('removeRouteTarget', payload)
    }
  }
}
</script>

<style lang="scss">
.audioroute__overs {
  display: flex;
}
</style>
