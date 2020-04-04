<template>
  <div class="auxmix__selector">
    <div class="choose__mixer" v-if="enabledSocketKeys.length > 1">
      <h3>Choose Mixer</h3>
      <div v-for="(item, index) in enabledSocketKeys"
        v-bind:item="item"
        v-bind:key="index+200">
        <input type="radio" :id="item" :value="item" v-model="cMixer">
        <label :for="item">{{ item }}</label>
      </div>
    </div>
    <div class="choose__inputs">
      <h3>Choose Inputs</h3>
      <div v-for="(item, index) in availableInputs"
        v-bind:item="item"
        v-bind:key="index+100">
          <input type="checkbox" :id="item.id" :value="item.channels" v-model="cInputs">
          <label :for="item.id">{{ item.label }}</label>
      </div>
    </div>
    <div class="choose__output">
      <h3>Choose Output</h3>
      <div v-for="(item, index) in availableOutputs"
        v-bind:item="item"
        v-bind:key="index+200">
          <input type="radio" :id="item.id" :value="item.channels" v-model="cOutput">
          <label :for="item.id">{{ item.label }}</label>
      </div>
    </div>
    <div class="choose__showrec">
      <h3>Show rec button?</h3>
      <input type="radio" id="showRec-yes" :value="true" v-model="cShowRec">
      <label for="showRec-yes">yes</label>
      <input type="radio" id="showRec-no" :value="false" v-model="cShowRec">
      <label for="showRec-no">no</label>
    </div>
    <div class="choose__nosleep">
      <h3>Show rec button?</h3>
      <input type="radio" id="noSleep-yes" :value="true" v-model="cNoSleep">
      <label for="noSleep-yes">yes</label>
      <input type="radio" id="noSleep-no" :value="false" v-model="cNoSleep">
      <label for="noSleep-no">no</label>
    </div>
    <h1>
    <div v-if="validUrlParams">
      <!--
        best practice to generate link fucks up the url by encoding special chars :/
        <router-link :to="{ name: 'MyAuxMixShow', params: { myAuxMixUrlParams: jsonifiedParams } }">static example configuration</router-link><br>
      -->
      <router-link :to="`${jsonifiedParams}`">READY TO GO... ({{ jsonifiedParams }})</router-link><br>
      <qrcode :value="jsonifiedParams" :options="{ width: 200 }"></qrcode>

    </div>
    <div v-else>
      choose your channel(s)...
    </div>
    </h1>
    <router-link :to="{ name: 'Home' }">back to menu</router-link><br>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyAuxMixConfigurator',
  data () {
    return {
      cMixer: '',
      cInputs: [],
      cOutput: [],
      cShowRec: false,
      cNoSleep: true
    }
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue',
      'getEnabledMixerSocketIds',
      'getCurSetup'
    ]),
    jsonifiedParams () {
      const testJson = [
        this.cMixer,
        this.cInputs,
        this.cOutput,
        this.cShowRec,
        this.cNoSleep
      ]
      return JSON.stringify(testJson)
    },
    validUrlParams () {
      if (this.cMixer === '') { return false }
      if (this.cInputs.length === 0) { return false }
      if (this.cOutput.length === 0) { return false }
      return true
    },
    availableInputs () {
      return this.fetchAvailableInputs()
    },
    availableOutputs () {
      return this.fetchAvailableOutputs()
    },
    enabledSocketKeys () {
      return this.getEnabledMixerSocketIds
    }
  },
  methods: {
    fetchAvailableInputs () {
      return this.collectChannelItems('input', 'i', 'CH')
    },
    fetchAvailableOutputs () {
      return this.collectChannelItems('aux', 'a', 'A')
    },
    collectChannelItems (setupKey, letter, labelFallback) {
      const inputs = []
      if (this.cMixer === '') {
        this.cInputs = []
        this.cOutput = []
        return inputs
      }
      let skipNext = false
      for (const i of [...Array(this.getCurSetup(this.cMixer)[setupKey])].keys()) {
        if (skipNext === true) {
          skipNext = false
          continue
        }
        const input = {
          label: this.readRemoteMixerValue({
            socketId: this.cMixer,
            key: `${letter}.${i}.name`
          }),
          channels: [parseInt(i)],
          id: `myauxmix-${letter}-${i}`
        }
        if (input.label === '') {
          // TODO move generic missing label func somewhere else as we ofgten need this
          input.label = `${labelFallback} ${input.channels[0] + 1}`
        }
        const stereoIndex = parseInt(
          this.readRemoteMixerValue({
            socketId: this.cMixer,
            key: `${letter}.${i}.stereoIndex`
          })
        )
        if (stereoIndex === 0) {
          input.label += ' (ST)'
          input.channels.push(parseInt(i) + 1)
          skipNext = true
        }
        inputs.push(input)
      }
      return inputs
    },
    checkForPreselectMixer () {
      if (this.enabledSocketKeys.length === 1) {
        this.cMixer = this.enabledSocketKeys[0]
      }
    }
  },
  mounted () {
    this.checkForPreselectMixer()
  }
}
</script>

<style>
.choose__inputs,
.choose__output {
  display: flex;
}

.choose__inputs label {
  white-space: nowrap;
}
</style>
