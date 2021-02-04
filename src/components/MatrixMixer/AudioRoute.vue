<template>
  <div class="matrixroutes__row dashed__border">
    <div class="btxn dashed__border">MUTE<br> rid:{{routeId}}</div>
    <div class="btxn dashed__border">HP<br>tid:{{route.targetChainId}}</div>
    <AudioRouteInput :routeInput="route.input" v-on:setRouteInput="setRouteInput"/>
    <AudioRouteOverChain
      :routeId="routeId"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
    />
    <span class="arrow">&#10145;</span>
    <AudioRouteOutput
      :routeOutput="getRouteOutputTarget"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
    />
    <div class="btxn dashed__border" @click="deleteRoute">&#10006;</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRouteInput from '@/components/MatrixMixer/AudioRouteInput.vue'
import AudioRouteOutput from '@/components/MatrixMixer/AudioRouteOutput.vue'
import AudioRouteOverChain from '@/components/MatrixMixer/AudioRouteOverChain.vue'
export default {
  name: 'AudioRoute',
  components: {
    AudioRouteInput,
    AudioRouteOutput,
    AudioRouteOverChain
  },
  props: {
    routeId: Number
  },
  computed: {
    ...mapGetters([
      'getRouteById',
      'getEnabledMatrixOvers',
      'getTargetChainById'
    ]),
    route () {
      return this.getRouteById(this.routeId)
    },
    getRouteOutputTarget () {
      if (typeof this.route.targetChainId === 'undefined') {
        return undefined
      }
      const targetChain = this.getTargetChainById(this.route.targetChainId)
      if (typeof targetChain === 'undefined') {
        return undefined
      }
      return targetChain.chain.filter(function (item) {
        return item.type === 'output'
      })[0]
    }
  },
  methods: {
    setRouteInput (payload) {
      this.route.input = payload
      this.saveRoute()
    },
    addRouteTarget (payload) {
      this.route.addToTargetChain = payload
      this.$store.commit('processRouteChange', this.route)
    },
    removeRouteTarget (payload) {
      this.route.removeFromTargetChain = payload
      this.$store.commit('processRouteChange', this.route)
    },
    saveRoute () {
      console.log('calling saveRoute() in AudioRoute.vue')
      this.$store.commit('saveMatrixRoute', this.route)
      this.$store.commit('setIsRoutedAttributes')
      this.$store.commit('applyOverChainsAndOutputs')
    },
    deleteRoute () {
      this.$store.commit('deleteMatrixRouteById', this.route.id)
      this.$store.commit('setIsRoutedAttributes')
      this.$store.commit('cleanupUnusedTargetChains')
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="scss">
.matrixroutes__row {
  display: table-row;
  justify-content: center;
  &>* {
    display: table-cell;
  }
}

.dashed__border {
  border: 3px dashed #6b6b88;
  padding: 5px;
  margin-bottom: 5px;
}

.arrow {
  display: flex;
  align-items: center;
  font-size: 50px;
  padding: 0 30px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
