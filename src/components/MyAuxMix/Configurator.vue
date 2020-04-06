<template>
  <div class="auxmix__configurator__page">
    <h2>Configure your AUX mix</h2>
    <div class="choose__mixer" v-if="enabledSocketKeys.length > 1">
      <div>Choose Mixer:</div>
      <div v-for="(item, index) in enabledSocketKeys" v-bind:key="index+200">
        <p-radio
          color="success"
          v-model="cMixer"
          :id="item"
          :value="item"
          class="p-plain p-icon p-round p-smooth">
          {{ item }}
        </p-radio>
      </div>
    </div>
    <div class="auxmix__configurator">
      <div class="configurator__column choose_inputs">
        <h3>Choose your inputs</h3>
        <div class="choose__configitems">
          <div v-for="(item, index) in availableInputs" v-bind:key="index+100">
            <p-check
              :id="item.id"
              :value="item.channels"
              v-model="cInputs"
              color="success"
              class="p-plain p-icon p-round p-smooth p-bigger">
              {{ item.label }}
            </p-check>
          </div>
        </div>
      </div>
      <div class="configurator__column choose_output">
        <h3>Choose your output</h3>
        <div class="choose__configitems">
          <div v-for="(item, index) in availableOutputs" v-bind:key="index+200">
            <p-radio
              :id="item.id"
              :value="item.channels"
              v-model="cOutput"
              color="success"
              class="p-plain p-icon p-round p-smooth p-bigger">
              {{ item.label }}
            </p-radio>
          </div>
        </div>
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
            <div v-if="validUrlParams">
              <router-link :to="`${confAsUrlParam()}`" class="btn">READY TO GO...</router-link><br><br><br>
              <qrcode :value="qrCodeUrl" :options="{ width: 200 }"></qrcode>
            </div>
            <div v-else class="btn">
              choose your channel(s)...
            </div>
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

<style lang="scss">

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
</style>
