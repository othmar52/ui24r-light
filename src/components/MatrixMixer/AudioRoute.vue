<template>
  <div :class="`matrixroutes__row ${route.muted && 'matrixroutes__row--muted'}`">
    <div class="btn--mute" @click="toggleMute" title="toggle mute/unmute">
      <IconMute />
    </div>
    <div :class="`btn--headphones ${route.toHeadphones && 'headphones__active'}`" @click="toggleHeadphones">
      <IconHeadphones />
    </div>
    <AudioRouteInput :routeInput="route.input" v-on:setRouteInput="setRouteInput"/>
    <AudioRouteOverChain
      :routeId="routeId"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
    />
    <AudioRouteOutput
      v-if="!hideOutput"
      :routeId="routeId"
      :routeOutput="getRouteOutputTarget"
      v-on:addRouteTarget="addRouteTarget"
      v-on:removeRouteTarget="removeRouteTarget"
    />
    <div class="dashed__border">
      <DelayedTrigger markup="" iconIdentifier="trash" v-on:actionTriggered="deleteRoute" v-if="routeId >= 0" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRouteInput from '@/components/MatrixMixer/AudioRouteInput.vue'
import AudioRouteOutput from '@/components/MatrixMixer/AudioRouteOutput.vue'
import AudioRouteOverChain from '@/components/MatrixMixer/AudioRouteOverChain.vue'
import DelayedTrigger from '@/components/MatrixMixer/DelayedTrigger.vue'
import IconHeadphones from '@/assets/img/headphones.svg'
import IconMute from '@/assets/img/mute.svg'
export default {
  name: 'AudioRoute',
  components: {
    AudioRouteInput,
    AudioRouteOutput,
    AudioRouteOverChain,
    DelayedTrigger,
    IconHeadphones,
    IconMute
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
      'getHideOutputSectionOnSingleOutput',
      'getMatrixHelperEnabled'
    ]),
    route () {
      // console.log(this.getRouteById(this.routeId))
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
      this.finishRouteChange()
    },
    toggleMute () {
      this.route.muted = !this.route.muted
      this.$store.commit('saveMatrixRoute', this.route)
      this.finishRouteChange()
    },
    toggleHeadphones () {
      this.route.toHeadphones = !this.route.toHeadphones
      this.$store.commit('saveMatrixRoute', this.route)
      this.finishRouteChange()
    },
    finishRouteChange () {
      if (this.getMatrixHelperEnabled === true) {
        this.$store.commit('cleanupEmptyRoutes')
        this.$store.commit('cleanupRoutesWithoutOverOrInput')
        this.$store.commit('cleanupDuplicateRoutes')
      }
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

</style>
