<template>
  <div class="auxmix__configurator__page">
    <h2>Configure Matrix in+outputs</h2>
    <div class="auxmix__configurator">
      <div class="configurator__column">
        <h3>Choose your inputs</h3>
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
        <div>
        <br>
        <button class="btn" @click="toggleAllInputs">toggle all</button>
        <button class="btn" @click="setDefaultMatrixPreset">preset 1</button>
        <br>
        <br>
        </div>

        <h3>Choose your outputs and I/O devices</h3>
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
          <div> |||<br>|||<br>|||<br>|||<br>|||<br>|||</div>
          <div v-for="(item, index) in matrixOvers" v-bind:key="index+900" class="matrixconf__item--over">
            <div
              @click="toggleOver"
              :data-channels="item.outputChannels"
              :data-enabled="item.enabled"
              :class="`matrixconf__item ${item.enabled ? 'enabled' : ''}`"
            >
            <OutputWithVu :item="item" />
            </div>
            <div
              @click="moveOverItemToRight"
              class="toggleover"
              :data-channels="item.inputChannels"
              v-if="index<matrixOvers.length-1 && matrixOvers.length>1"
            >&#11020;</div>
          </div>
        </div>
        <br><br><br><br>

        <router-link :to="{ name: 'MatrixMixerShow' }" class="btn">all done</router-link><br>
      </div>
      <div class="configurator__column configurator__column-last">
        <h3>More options</h3>
        <div class="configurator__verticalsections">
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
            <br><br>
          </div>
          <div class="configurator__result">

          </div>
          <router-link :to="{ name: 'Home' }" class="btn">back to menu</router-link><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* @see https://hamed-ehtesham.github.io/pretty-checkbox-vue/ */
import { mapGetters } from 'vuex'
// import VuMeter from '@/components/VuMeter.vue'
// import VuMeterStereo from '@/components/VuMeterStereo.vue'
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
      cMixer: '',
      cInputs: [],
      cOutput: [],
      matrixInputs: this.$store.state.matrixInputs,
      matrixOutputs: this.$store.state.matrixOutputs,
      matrixOvers: this.$store.state.matrixOvers,
      cShowRec: false,
      cNoSleep: true
    }
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue',
      'getEnabledMixerSocketIds',
      'getMatrixInputs',
      'getMatrixOutputs',
      'getCurSetup'
    ]),
    enabledSocketKeys () {
      return this.getEnabledMixerSocketIds
    }
  },
  methods: {
    checkForPreselectMixer () {
      if (this.enabledSocketKeys.length === 1) {
        this.cMixer = this.enabledSocketKeys[0]
      }
    },
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
    setDefaultMatrixPreset () {
      this.$store.commit('setDefaultMatrixPreset')
      // console.log('model matrixInputs', this.matrixInputs)
    },
    moveOverItemToRight (event) {
      // console.log('moveOverItemToRight', event.currentTarget.dataset)
      this.$store.commit('moveOverItemToRight', event.currentTarget.dataset.channels)
    }
  },
  watch: {
    cMixer () {
      // reset already selected channels on mixer change as it may not be compatible (stereo settings)
      this.cInputs = []
      this.cOutput = []
    }
  },
  mounted () {
    // in case only one mixer exists we can preselect it
    this.checkForPreselectMixer()
  }
}
</script>

<style lang="scss">

.matrixconf__items {
  display: flex;
  flex-wrap: wrap;
  .vuued__channel {
    width: 160px;
    padding: 5px;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0;
  }
}

.auxmix__configurator__page {
  height: 100%;
  .auxmix__configurator {
    display: flex;
    height: 100%;
    h3 {
      border-bottom: 1px solid #444454;
      padding-bottom: 5px;
    }
    &>* {
      flex-grow: 1;
      overflow-y: scroll;
    }
    .configurator__column:last-child {
      min-width: 220px;
      max-width: 220px;
    }
  }

}

.choose__mixer {
  display: flex;
  align-items: center;
  justify-content: center;
  &>* {
    padding: 1em;
  }
}

.choose_inputs,
.choose_output {
  border-right: 1px solid #444454;
}

.choose__configitems {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
}

.choose__configitems {
  text-align: left;
  &>div {
    padding: 5px;
    margin: 0;
    min-width: 160px;
    max-width: 160px;
  }
}

.configurator__verticalsections {
  display: flex;
  flex-direction: column;
  &>div {
    padding: 5px;
    margin: 0;
  }
}

.choose__inputs label {
  white-space: nowrap;
}

.matrixconf__item {
  opacity: 0.3;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0px 4px 3px rgba(0,0,0,0.4),
             0px 8px 13px rgba(0,0,0,0.1),
             0px 18px 23px rgba(0,0,0,0.1);
}

.matrixconf__items .enabled {
  opacity: 1;
}

.matrixconf__item--over {
  display: flex;
  align-items: center;
}

.toggleover {
  font-size: 30px;
  padding: 0 10px;
  flex-grow: 0;
  flex-shrink: 0;
}

/* 1-11 are ui24r's colors, 12-16 are custom script extended colors */
.color-1 { background-color: #111111; }
.color-2 { background-color: #8B0000; }
.color-3 { background-color: #FF0000; } /* red */
.color-4 { background-color: #FFA500; }
.color-5 { background-color: #FFFF00; color: #444;} /* yellow */
.color-6 { background-color: #56DE43; color: #444;} /* green */
.color-7 { background-color: #0091C2; } /* lightblue */
.color-8 { background-color: #9400D3; }
.color-9 { background-color: #808080; }
.color-10 { background-color: #FFFFFF; }
.color-11 { background-color: #FF1493; }
.color-12 { background-color: #00FFFF; }
.color-13 { background-color: #009688; }
.color-14 { background-color: #3a4caf; }
.color-15 { background-color: #966100; } /* brown */
.color-16 { background-color: #ff9800; color: #333;} /* orange */
.color-undefined { background-color: #000;} /* black */

</style>
