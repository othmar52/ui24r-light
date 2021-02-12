<template>
  <div class="matrix__configurator__page">
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'Home' }" class="">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        Matrix Mixer Config
      </h2>
      <nav class="nav nav--subnav">
        <button class="btn" @click="setDefaultMatrixPreset">load preset 1</button>
      </nav>
    </header>
    <div class="matrix__configurator">
      <div class="configurator__column">
        <h3>Inputs
          <button class="btn" @click="toggleAllInputs">toggle all</button>
        </h3>
        <div class="matrixconf__items matrixconf__items--inputs">
          <div
            v-for="(item, index) in matrixInputs" v-bind:key="index+100"
            @click="toggleInput"
            :data-channels="item.inputChannels"
            :data-enabled="item.enabled"
            :class="`matrixconf__item ${item.enabled ? 'enabled' : ''}`"
          >
            <InputWithVu :item="item" />
          </div>
        </div>
      </div>

      <div class="configurator__column">
        <h3>Outputs</h3>
        <div class="matrixconf__items matrixconf__items--outputs">
          <div
            v-for="(item, index) in matrixOutputs" v-bind:key="index+100"
            @click="toggleOutput"
            :data-channels="item.outputChannels"
            :data-enabled="item.enabled"
            :class="`matrixconf__item ${item.enabled ? 'enabled' : ''}`"
          >
            <OutputWithVu :item="item" />
          </div>
        </div>
      </div>

      <div class="configurator__column">
        <h3>In/Out Devices</h3>
        <div v-for="(item, index) in matrixOvers" v-bind:key="index+900" class="matrixconf__items matrixconf__items--over">
          <div
            @click="toggleOver"
            :data-channels="item.outputChannels"
            :data-enabled="item.enabled"
            :class="`matrixconf__item ${item.enabled ? 'enabled' : ''}`"
          >
            <OutputWithVu :item="item" />
          </div>
        </div>
      </div>

      <div class="configurator__column">
        <h3>More options</h3>
          <div class="switches">
            <p-check class="p-switch p-fill"
              v-model="helperActive"
              @change="setMatrixHelperEnabled"
              >
              Helper
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="enableAllInputsAlwaysVisible"
              @change="setShowOutputsInline"
              >
              Always show all inputs
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="autoRouteActive"
              @change="setAutoRouteEnabled"
              v-if="getEnabledMatrixOutputs.length === 1 && enableAllInputsAlwaysVisible === false"
              >
              Auto route
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="hideAutoRouteActive"
              @change="setHideAutoRouteEnabled"
              v-if="getEnabledMatrixOutputs.length === 1 && autoRouteActive && enableAllInputsAlwaysVisible === false"
              >
              Hide Auto route
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="showOutputsInlineActive"
              @change="setShowOutputsInline"
              v-if="getEnabledMatrixOutputs.length > 1"
              >
              Show outputs inline
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="vuEnabled"
              @change="setVuEnabled"
              >
              Enable VU
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="debounceVuActive"
              @change="setDebounceVu"
              v-if="vuEnabled"
              >
              Debounce VU
            </p-check>
            <p-check class="p-switch p-fill"
              v-model="enableRouteBuilder"
              @change="setEnableRouteBuilder"
              v-if="vuEnabled"
              >
              Route Builder
            </p-check>
            <!--
              TODO: implement tose as well
              <div class="choose__showrec">
                <p-check
                  :value="true"
                  v-model="cShowRec"
                  color="success"
                  class="p-plain p-icon p-round p-smooth p-bigger">
                  Show rec button
                </p-check>
              </div>
              <div class="choose__nosleep">
                <p-check
                  :value="true"
                  v-model="cNoSleep"
                  color="success"
                  class="p-plain p-icon p-round p-smooth p-bigger">
                  no sleep
                </p-check>
              </div>
            -->
          </div>
          <router-link :to="{ name: 'MatrixMixerShow' }" class="btn btn-fullwidth">
            all done<br>show routes
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* @see https://hamed-ehtesham.github.io/pretty-checkbox-vue/ */
import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
import OutputWithVu from '@/components/MatrixMixer/OutputWithVu.vue'
export default {
  name: 'MatrixMixerConfigurator',
  components: {
    // VuMeter,
    // VuMeterStereo,
    InputWithVu,
    OutputWithVu
  },
  data () {
    return {
      matrixInputs: this.$store.state.matrixInputs,
      matrixOutputs: this.$store.state.matrixOutputs,
      matrixOvers: this.$store.state.matrixOvers,
      cShowRec: false,
      cNoSleep: true,
      helperActive: this.$store.state.enableMatrixHelper,
      autoRouteActive: this.$store.state.autoRouteSingleOutput,
      hideAutoRouteActive: this.$store.state.hideOutputSectionOnSingleOutput,
      showOutputsInlineActive: this.$store.state.showOutputsInline,
      vuEnabled: this.$store.state.sockets.mixer1.enableVu,
      debounceVuActive: this.$store.state.sockets.mixer1.debounceVu,
      enableRouteBuilder: this.$store.state.enableRouteBuilder,
      enableAllInputsAlwaysVisible: this.$store.state.enableAllInputsAlwaysVisible
    }
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue',
      'getEnabledMixerSocketIds',
      'getMatrixInputs',
      'getMatrixOutputs',
      'getEnabledMatrixOutputs',
      'getCurSetup'
    ]),
    enabledSocketKeys () {
      return this.getEnabledMixerSocketIds
    }
  },
  methods: {
    toggleAllInputs () {
      // toggle all state based on amount
      const payload = {
        channels: null,
        enabled: (this.matrixInputs.filter(function (el) {
          return el.enabled === true
        }).length < this.matrixInputs.length) ? 'false' : 'true'
      }

      for (const item of this.matrixInputs) {
        payload.channels = item.inputChannels.join(',')
        this.$store.commit('toggleEnableMatrixInput', payload)
      }
    },
    toggleInput (event) {
      this.$store.commit('toggleEnableMatrixInput', event.currentTarget.dataset)
    },
    toggleOutput (event) {
      this.$store.commit('toggleEnableMatrixOutput', event.currentTarget.dataset)
    },
    toggleOver (event) {
      this.$store.commit('toggleEnableMatrixOver', event.currentTarget.dataset)
    },

    setMatrixHelperEnabled (val) {
      this.$store.commit('setMatrixHelper', val)
    },
    setAutoRouteEnabled (val) {
      this.$store.commit('setEnableAutoRoute', val)
    },
    setHideAutoRouteEnabled (val) {
      this.$store.commit('setHideAutoRoute', val)
    },
    setVuEnabled (val) {
      this.$store.commit('setVuEnabled', val)
    },
    setDebounceVu (val) {
      this.$store.commit('setDebounceVu', val)
    },
    setShowOutputsInline (val) {
      this.$store.commit('setShowOutputsInline', val)
    },
    setEnableRouteBuilder (val) {
      this.$store.commit('setEnableRouteBuilder', val)
    },
    setEnableAllInputsAlwaysVisible (val) {
      this.$store.commit('setEnableAllInputsAlwaysVisible', val)
    },
    setDefaultMatrixPreset () {
      this.$store.commit('setDefaultMatrixPreset')
      // console.log('model matrixInputs', this.matrixInputs)
    }
  }
}
</script>
