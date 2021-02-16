<template>
  <div class="page page--matrixrouter">
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'Home' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
        <div class="btn" @click="muteAllAudioRoutes" v-if="!getAreAllRoutesMuted">
          Mute all
        </div>
        <div class="btn" @click="unmuteAllAudioRoutes" v-if="getIsAnyRouteMuted">
          Unmute all
        </div>
      </nav>
      <h2>
        AUDIO ROUTES
        <DelayedTrigger markup="" iconIdentifier="trash" v-on:actionTriggered="resetAudioRoutes" v-if="getMatrixRoutes.length > 0" />
      </h2>
      <nav class="nav nav--subnav">
        <p-check class="p-switch p-fill" v-model="helperActive" @change="setMatrixHelperEnabled">Helper</p-check>
        <router-link :to="{ name: 'MatrixMixerConfigurator' }" class="icon">
          <IconCog />
        </router-link>
        <div v-if="showGlobalVuMeter" class="vuued__channel vuued__channel--output vuued__channel--global">
          <VuMeter
              v-if="getGlobalOutput.outputChannels.length === 1"
              :keyVu="`vu.a.${getGlobalOutput.outputChannels[0]}.mix`"
              socketId="mixer1"
          />
          <VuMeterStereo
              v-else
              :keyVuLeft="`a.${getGlobalOutput.outputChannels[0]}.mix`"
              :keyVuRight="`a.${getGlobalOutput.outputChannels[1]}.mix`"
              socketId="mixer1"
          />
        </div>
      </nav>
    </header>
    <div class="matrixroutes">
      <AudioRoute
        v-for="(audioRoute, index) in getMatrixRoutes"
        v-bind:key="index+888"
        class="matrixroutes__row"
        :routeId="audioRoute.id"
      />
      <AudioRoute class="matrixroutes__row" />
    </div>
    <!--
    <span>amount routes: {{debugRoutesLength}}</span><br>
    <span>amount targetChains: {{debugChainLength}}</span><br>
    <span
      v-for="(targetChain, index) in getMatrixTargetChains"
      v-bind:key="index+8888"
      class=""> {{targetChain.id}} (
      <span
        v-for="(target, index) in targetChain.chain"
        v-bind:key="index+8988"
        class=""> {{target.name}} ➡
      </span>)<br />
    </span>
    -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRoute from '@/components/MatrixMixer/AudioRoute.vue'
import DelayedTrigger from '@/components/MatrixMixer/DelayedTrigger.vue'
import VuMeter from '@/components/VuMeter.vue'
import VuMeterStereo from '@/components/VuMeterStereo.vue'
import IconCog from '@/assets/img/cog.svg'
// import IconMute from '@/assets/img/mute.svg'

export default {
  name: 'MatrixMixerShow',
  data () {
    return {
      newRouteWizardOpen: false,
      helperActive: this.$store.state.enableMatrixHelper
    }
  },
  components: {
    DelayedTrigger,
    AudioRoute,
    VuMeterStereo,
    VuMeter,
    // IconMute,
    IconCog
  },
  props: {
    myInputChannels: Array
  },
  computed: {
    ...mapGetters([
      'getRouteById',
      'getMatrixRoutes',
      'getMatrixTargetChains',
      'getMatrixHelperEnabled',
      'getHideOutputSectionOnSingleOutput',
      'getAutoOutputRouteEnabled',
      'getEnabledMatrixOutputs',
      'getEnabledMatrixInputs',
      'getVuEnabled',
      'getIsAnyRouteMuted',
      'getAreAllRoutesMuted'
    ]),
    debugChainLength () {
      return Object.keys(this.getMatrixTargetChains).length
    },
    debugRoutesLength () {
      return this.getMatrixRoutes.length
    },
    showGlobalVuMeter () {
      return this.getHideOutputSectionOnSingleOutput === true &&
        this.getAutoOutputRouteEnabled === true &&
        this.getEnabledMatrixOutputs.length === 1 &&
        this.getVuEnabled('mixer1') === true
    },
    getGlobalOutput () {
      return (this.showGlobalVuMeter) ? this.getEnabledMatrixOutputs[0] : {}
    }
  },
  methods: {
    resetAudioRoutes () {
      this.$store.commit('resetAudioRoutes')
      this.$store.commit('cleanupUnusedTargetChains')
      this.$store.commit('setIsRoutedAttributes')
      this.$store.commit('updateMixerByMatrixState')
      this.$store.commit('setIsRoutedAttributes')
    },
    cancelWizard () {
      this.newRouteWizardOpen = false
    },
    setMatrixHelperEnabled (val) {
      this.$store.commit('setMatrixHelper', val)
    },
    muteAllAudioRoutes (val) {
      this.$store.commit('muteAllAudioRoutes')
      this.$store.commit('updateMixerByMatrixState')
    },
    unmuteAllAudioRoutes (val) {
      this.$store.commit('unmuteAllAudioRoutes')
      this.$store.commit('updateMixerByMatrixState')
    }
  },
  mounted () {
    // this.foo = this.getMatrixHelperEnabled
    for (const inputItem of this.getEnabledMatrixInputs) {
      if (this.getMatrixRoutes.filter(el => el.inputId === inputItem.id).length === 0) {
        const newRoute = this.getRouteById()
        newRoute.setInput = inputItem
        this.$store.commit('processRouteChange', newRoute)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
