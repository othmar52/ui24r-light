<template>
  <div class="matrixroutes__row dashed__border">
    <div class="btxn dashed__border">MUTE {{routeId}}</div>
    <div class="btxn dashed__border">HP</div>
    <AudioRouteInput :routeInput="route.from.input" v-on:setRouteInput="setRouteInput"/>
    <AudioRouteOverChain :routeId="routeId" v-on:toggleBypassOver="toggleBypassOver" />
    <!--div v-for="(item, index) in route.over" v-bind:key="index+700">
        <span
          class="arrow"
          @click="moveOverToLeft"
          :data-channels="item.output.channels">
          &#10145;</span>
        over: {{ item.input.name }}<br>
        <button
          @click="bypassRouteOver"
          :data-channels="item.output.channels">
          bypass
        </button>
    </div-->
    <span class="arrow">&#10145;</span>
    <AudioRouteOutput :routeOutput="route.to.output" v-on:setRouteOutput="setRouteOutput"/>
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
      'getEnabledMatrixOvers'
    ]),
    route () {
      return this.getRouteById(this.routeId)
    }
  },
  methods: {
    bypassRouteOver () {
      // console.log('bypassRouteOver')
    },
    setRouteInput (payload) {
      this.route.from.input = payload
      this.saveRoute()
    },
    setRouteOutput (payload) {
      // TODO: consider to show conflicts before acually changing routes

      // if we don't have any over
      if (this.route.over.length === 0) {
        // console.log('no overs within this route')
        this.route.to.output = payload
        this.saveRoute()
        return
      }
      // otherwise apply routing target to last active item in over chain
      const lastActiveOverWithinThisRoute = this.route.over[this.route.over.length - 1]
      console.log('lastActiveOverWithinThisRoute', lastActiveOverWithinThisRoute.name)
      this.route.to.output = payload // invalid!!!
      this.saveRoute()
    },
    toggleBypassOver (payload) {
      // console.log('toggleBypassOver PARENT PARENT', payload)
      if (typeof this.route.id === 'undefined') {
        // we have a new route starting with an over (no input)
        this.route.over.push(payload)
        this.$store.commit('saveMatrixRoute', this.route)
        this.$store.commit('setIsRoutedAttributes')
        return
      }
      let overIsActiveIndex = -1
      const that = this
      this.route.over.forEach(function (over, idx) {
        if (over.inputChannels.join(',') !== payload.inputChannels.join(',')) {
          return
        }
        // we have an removal of over
        overIsActiveIndex = idx
        that.route.over = that.route.over.filter(function (item) {
          return item.inputChannels.join(',') !== payload.inputChannels.join(',')
        })
        that.$store.commit('saveMatrixRoute', that.route)
        that.$store.commit('setIsRoutedAttributes')
      })
      if (overIsActiveIndex !== -1) {
        return
      }
      // TODO : apply rest of active over chain
      this.route.over.push(payload)
    },
    saveRoute () {
      this.$store.commit('saveMatrixRoute', this.route)
      this.$store.commit('setIsRoutedAttributes')
      this.$store.commit('applyOverChainsAndOutputs')
    },
    deleteRoute () {
      this.$store.commit('deleteMatrixRouteById', this.route.id)
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
  display: flex;
  justify-content: center;
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
