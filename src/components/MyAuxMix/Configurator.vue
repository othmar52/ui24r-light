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
      <h3>Activate nosleep?</h3>
      <input type="radio" id="noSleep-yes" :value="true" v-model="cNoSleep">
      <label for="noSleep-yes">yes</label>
      <input type="radio" id="noSleep-no" :value="false" v-model="cNoSleep">
      <label for="noSleep-no">no</label>
    </div>
    URL: {{qrCodeUrl}}
    <h1>
    <div v-if="validUrlParams">
      <!--
        best practice to generate link fucks up the url by encoding special chars :/
        <router-link :to="{ name: 'MyAuxMixShow', params: { myAuxMixUrlParams: confAsJsonString } }">static example configuration</router-link><br>
      -->
      <router-link :to="`${confAsUrlParam()}`">READY TO GO...</router-link><br>
      <qrcode :value="qrCodeUrl" :options="{ width: 200 }"></qrcode>
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
      /*
         `readableJsonUrl` is just for debugging purposes.
         desktop browsers seems to have no problem with non encoded urls
         but mobile browsers needs encoded urls
           http(s)://ui24r.light/#/mymix/["mixer2",[[0,1]],[0],false,true]
           vs.
           http(s)://ui24r.light/#/mymix/%5B%22mixer2%22,%5B%5B0,1%5D%5D,%5B0%5D,false,true%5D
      */
      readableJsonUrl: false,
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
    // qr code only makes sense with http server and domain instead of file:// protocol
    qrCodeUrl () {
      // TODO: read domain from configuration
      const domain = 'http://ui24r.mpd/dist/'
      // TODO: can we retrieve this from router config instead of hardcoding path?
      const routePath = '#/mymix/'
      return domain + routePath + this.confAsUrlParam()
    },
    validUrlParams () {
      if (this.cMixer === '') { return false }
      if (this.cInputs.length === 0) { return false }
      if (this.cOutput.length === 0) { return false }
      return true
    },
    availableInputs () {
      return this.collectChannelItems('input', 'i', 'CH')
    },
    availableOutputs () {
      return this.collectChannelItems('aux', 'a', 'A')
    },
    enabledSocketKeys () {
      return this.getEnabledMixerSocketIds
    }
  },
  methods: {
    confAsJsonString () {
      const confAsJson = [
        this.cMixer,
        this.cInputs,
        this.cOutput,
        this.cShowRec,
        this.cNoSleep
      ]
      return JSON.stringify(confAsJson)
    },
    confAsUrlParam () {
      if (this.readableJsonUrl === true) {
        return this.confAsJsonString()
      }
      return encodeURI(this.confAsJsonString())
    },
    collectChannelItems (setupKey, letter, labelFallback) {
      const channelItems = []
      if (this.cMixer === '') {
        this.cInputs = []
        this.cOutput = []
        return channelItems
      }
      let skipNext = false
      for (const i of [...Array(this.getCurSetup(this.cMixer)[setupKey])].keys()) {
        if (skipNext === true) {
          skipNext = false
          continue
        }
        const channelItem = {
          label: this.readRemoteMixerValue({
            socketId: this.cMixer,
            key: `${letter}.${i}.name`
          }),
          channels: [parseInt(i)],
          id: `myauxmix-${letter}-${i}`
        }
        if (channelItem.label === '') {
          // TODO move generic missing label func somewhere else as we often need this
          channelItem.label = `${labelFallback} ${channelItem.channels[0] + 1}`
        }
        const stereoIndex = parseInt(
          this.readRemoteMixerValue({
            socketId: this.cMixer,
            key: `${letter}.${i}.stereoIndex`
          })
        )

        // possible stereoIndex values:
        //   -1 means mono channel (no stereo link)
        //    0 means left stereo channel
        //    1 means right stereo channel
        if (stereoIndex === 0) {
          // stereoLink active! add linked(next) channel to this channelItem
          channelItem.channels.push(parseInt(i) + 1)
          // reflect stereo link in item label
          channelItem.label += ' (ST)'
          // make sure to skip next item as its already in use
          skipNext = true
        }
        channelItems.push(channelItem)
      }
      return channelItems
    },
    checkForPreselectMixer () {
      if (this.enabledSocketKeys.length === 1) {
        this.cMixer = this.enabledSocketKeys[0]
      }
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

<style>
.choose__inputs,
.choose__output {
  display: flex;
}

.choose__inputs label {
  white-space: nowrap;
}
</style>
