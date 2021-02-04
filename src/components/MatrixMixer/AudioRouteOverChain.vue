<template>
  <div class="audioroute__overs">
    <div class="audioroute__over-wrap">
      <AudioRouteOver
        v-for="(overItem, overIndex) in getEnabledMatrixOvers"
        v-bind:key="overIndex+100"
        :routeId="routeId"
        :overItem="overItem"
        v-on:addRouteTarget="addRouteTarget"
        v-on:removeRouteTarget="removeRouteTarget"
      />
    </div>
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
.audioroute__over-wrap {
  display: flex;
  width: 100%;
  align-items: stretch;
}

</style>
