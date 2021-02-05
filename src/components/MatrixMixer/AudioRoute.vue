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
    <span class="arrow" v-if="!hideOutput">&#10145;</span>
    <AudioRouteOutput
      v-if="!hideOutput"
      :routeOutput="getRouteOutputTarget"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
    />
    <div class="dashed__border">
      <DelayedTrigger markup="&#10006;" v-on:actionTriggered="deleteRoute" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRouteInput from '@/components/MatrixMixer/AudioRouteInput.vue'
import AudioRouteOutput from '@/components/MatrixMixer/AudioRouteOutput.vue'
import AudioRouteOverChain from '@/components/MatrixMixer/AudioRouteOverChain.vue'
import DelayedTrigger from '@/components/MatrixMixer/DelayedTrigger.vue'
export default {
  name: 'AudioRoute',
  components: {
    AudioRouteInput,
    AudioRouteOutput,
    AudioRouteOverChain,
    DelayedTrigger
  },
  props: {
    routeId: Number
  },
  computed: {
    ...mapGetters([
      'getRouteById',
      'getEnabledMatrixOvers',
      'getEnabledMatrixOutputs',
      'getTargetChainById',
      'getAutoOutputRouteEnabled',
      'getHideOutputSectionOnSingleOutput'
    ]),
    route () {
      return this.getRouteById(this.routeId)
    },
    hideOutput () {
      return this.getHideOutputSectionOnSingleOutput === true &&
        this.getAutoOutputRouteEnabled === true &&
        this.getEnabledMatrixOutputs.length === 1
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
      if (typeof payload === 'undefined') {
        this.route.removeInput = true
        this.$store.commit('processRouteChange', this.route)
        return
      }
      this.route.setInput = payload
      this.$store.commit('processRouteChange', this.route)
    },
    addRouteTarget (payload) {
      this.route.addToTargetChain = payload
      this.$store.commit('processRouteChange', this.route)
    },
    removeRouteTarget (payload) {
      this.route.removeFromTargetChain = payload
      this.$store.commit('processRouteChange', this.route)
    },
    deleteRoute () {
      this.$store.commit('deleteMatrixRouteById', this.route.id)
      this.$store.commit('cleanupUnusedTargetChains')
      this.$store.commit('setIsRoutedAttributes')
      this.$store.commit('updateMixerByMatrixState')
      this.$store.commit('setIsRoutedAttributes')
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
