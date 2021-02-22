<template>
  <div class="audioroute__input centeXXXred__flex">
    <div @click="toggleInputSelectorWizard" class="centered__flex">
      <span class="arrow arrow--hidden">&#10145;</span>
      <div v-if="routeInput" >
        <InputWithVu :item="routeInput"/>
      </div>
      <div v-else class="unrouted">
        no input
      </div>
    </div>
    <div v-if="wizardOpen" class="matrixconf__wizard matrixconf__wizard--input">
      <div class="matrixconf__inputs">
        <div v-for="(itemPair, index) in getAvailableMatrixInputsPaired" v-bind:key="index+150">
            <div v-for="(item, index) in itemPair" v-bind:key="index+450">
            <div
              @click="chooseInput"
              :data-channels="item.inputChannels">
              <InputWithVu :item="item" />
            </div>
          </div>
        </div>
        <div class="lastrow">
          <div
            class="vuued__channel vuued__channel--disabledvu"
            @click="chooseInput"
            :data-channels="undefined">
            <span class="color-9">
            NO INPUT
            </span>
          </div>
          <div @click="cancelWizard">cancel</div>
        </div>
        <div class="lastrow" v-if="haveCsvLinkCC">
          <router-link :to="{ name: 'CcTablesShow', params: { deviceId: routeInput.id } }" class="btn">
            {{routeInput.name}} CC table
          </router-link>
        </div>
        <div class="lastrow" v-if="haveCsvLinkPatchList">
          <router-link :to="{ name: 'PatchListShow', params: { deviceId: routeInput.id } }" class="btn">
            {{routeInput.name}} Patchlist
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
export default {
  name: 'AudioRouteInput',
  components: {
    InputWithVu
  },
  props: {
    routeInput: {
      type: Object,
      default: function () {
        return undefined
      }
    }
  },
  data () {
    return {
      wizardOpen: false
    }
  },
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getEnabledMatrixInputs',
      'getUnroutedMatrixInputs',
      'getMatrixHelperEnabled'
    ]),
    getAvailableMatrixInputs () {
      return (this.getMatrixHelperEnabled === true)
        ? this.getUnroutedMatrixInputs
        : this.getEnabledMatrixInputs
    },
    // old mobile browser doesnt render correctly with display:flex so use display:table
    getAvailableMatrixInputsPaired () {
      const pairedItems = []
      let currentPair = []
      for (const item of this.getAvailableMatrixInputs) {
        if (currentPair.length === 2) {
          pairedItems.push(currentPair)
          currentPair = []
        }
        currentPair.push(item)
      }
      if (currentPair.length > 0) {
        pairedItems.push(currentPair)
      }
      return pairedItems
    },
    haveCsvLinkCC () {
      if (!this.routeInput) {
        return false
      }
      if (typeof this.routeInput.cccsv === 'undefined') {
        return false
      }
      return true
    },
    haveCsvLinkPatchList () {
      if (!this.routeInput) {
        return false
      }
      return this.routeInput.patchcsv.length > 0
    }
  },
  methods: {
    toggleInputSelectorWizard () {
      this.wizardOpen = !this.wizardOpen
    },
    chooseInput (event) {
      this.wizardOpen = false
      for (const item of this.getMatrixInputs) {
        if (event.currentTarget.dataset.channels !== item.inputChannels.join(',')) {
          continue
        }
        this.$emit('setRouteInput', item)
        return
      }
      this.$emit('setRouteInput', undefined)
    },
    cancelWizard (event) {
      this.wizardOpen = false
    }
  }
}
</script>

<style lang="scss">

</style>
