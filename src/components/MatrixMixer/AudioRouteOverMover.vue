<template>
  <div>
    <div class="arrow" v-if="isFirstEnabledOverItem">&#10145;</div>
    <div v-else @click="moveOver">
      <div v-if="delayActive" class="arrow arrow--confirm"><br>sure?</div>
      <div class="arrow--hovertoggle" v-else>
        <span class="arrow">&#10145;</span>
        <span class="arrow arrow--double">&#11020;</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AudioRouteOverMover',
  data () {
    return {
      delayActive: false
    }
  },
  props: {
    overItem: Object
  },
  computed: {
    ...mapGetters([
      'getRouteById',
      'getTargetChainById',
      'getEnabledMatrixOvers'
    ]),
    isFirstEnabledOverItem () {
      try {
        return this.getEnabledMatrixOvers[0].id === this.overItem.id
      } catch (e) {
        return false
      }
    }
  },
  methods: {
    moveOver () {
      if (this.delayActive === false) {
        this.delayActive = true
        const that = this
        setTimeout(function () { that.delayActive = false }, 2000)
        return
      }
      this.delayActive = false
      this.$emit('actionTriggered')
      // console.log('moveOver')
      this.$store.commit('moveOverItemToLeft', this.overItem.inputChannels.join(','))
      /*
      this.$emit(
        (this.overActiveForRoute) ? 'removeRouteTarget' : 'addRouteTarget',
        this.overItem
      )
      */
    }
  }
}
</script>

<style lang="scss">

.arrow--hovertoggle {
  .arrow--double {
    display: none;
  }
  &:hover {
    cursor: pointer;
    .arrow {
      display: none;
    }
    .arrow--double {
      display: block;
    }
  }
}

.arrow.arrow--confirm {
  font-size: 16px;
}
</style>
