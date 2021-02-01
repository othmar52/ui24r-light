<template>
  <div class="slider__container">
    <h2>spaceship matrix audio router</h2>
    <div class="matrixroutes">
      <AudioRoute
        v-for="(audioRoute, index) in getMatrixRoutes"
        v-bind:key="index+888"
        class="matrixroutes__row"
        :routeId="index"
      />
      <AudioRoute class="matrixroutes__row" />
    </div>
    <!--NewRouteWizard v-if="newRouteWizardOpen" v-on:cancelWizard="cancelWizard" /-->
    <br>
    <br>
    <br>
    <br>

    <router-link :to="{ name: 'MatrixMixerConfigurator' }" class="btn">
      matrix config
    </router-link>
    |||<span class="btn" @click="resetAudioRoutes">remove all routes</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import NewRouteWizard from '@/components/MatrixMixer/NewRouteWizard.vue'
import AudioRoute from '@/components/MatrixMixer/AudioRoute.vue'
export default {
  name: 'MatrixMixerShow',
  data () {
    return {
      newRouteWizardOpen: false
    }
  },
  components: {
    // NewRouteWizard,
    AudioRoute
  },
  props: {
    myInputChannels: Array
  },
  computed: {
    ...mapGetters([
      'getMatrixRoutes'
    ])
  },
  methods: {
    resetAudioRoutes () {
      // console.log('new route')
      this.$store.commit('resetAudioRoutes')
      this.$store.commit('setIsRoutedAttributes')
    },
    cancelWizard () {
      this.newRouteWizardOpen = false
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">

</style>
