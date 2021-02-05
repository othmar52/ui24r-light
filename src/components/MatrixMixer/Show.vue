<template>
  <div class="slider__container">
    <h2>spaceship matrix audio router
      <div class="btn__nav">
        <div>
          <button
            :class="`btn btn-helper ${(getMatrixHelperEnabled) ? 'enabled' : ''}`"
            @click="toggleHelper"
          >
            HELPER
          </button>
          <router-link :to="{ name: 'MatrixMixerConfigurator' }" class="btn">
            matrix config
          </router-link>
          <div class="btn">
            <DelayedTrigger markup="remove all routes" v-on:actionTriggered="resetAudioRoutes" />
          </div>
        </div>
      </div>
    </h2>
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
export default {
  name: 'MatrixMixerShow',
  data () {
    return {
      newRouteWizardOpen: false
    }
  },
  components: {
    DelayedTrigger,
    AudioRoute
  },
  props: {
    myInputChannels: Array
  },
  computed: {
    ...mapGetters([
      'getMatrixRoutes',
      'getMatrixTargetChains',
      'getMatrixHelperEnabled'
    ]),
    debugChainLength () {
      return Object.keys(this.getMatrixTargetChains).length
    },
    debugRoutesLength () {
      return this.getMatrixRoutes.length
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
    toggleHelper () {
      this.$store.commit('toggleMatrixHelper')
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
.matrixroutes {
  display: table;
  width: 100%;
}

.btn.btn-helper {
  opacity: 0.3;
  color: white;
  &.enabled {
    opacity: 1;
  }
}

.btn__nav {
  display: inline-block;
  &>div {
    display: flex;
    font-size: 14px;
    &>* {
      margin-left: 10px;
    }
  }
}
</style>
