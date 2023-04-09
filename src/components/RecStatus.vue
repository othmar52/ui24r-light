<template>
    <div :class="`rec__status rec__status-${stateClass}`">
    <div>
    <div v-if="state">
        <strong>#{{ remoteVarSession }}</strong><br>
        <div class="rec__time">
            {{ formatSeconds(remoteVarTime) }}
        </div>
        <div class="rec__buffer" v-if="remoteVarMtkBufferFill > 0.1">
          <div class="rec__buffer-bar" :style="bufferBarWidth"> </div>
        </div>
        <div class="dropout" v-if="remoteVarMtkDropOuts > 0">
            WARNING<br>
            {{ remoteVarMtkDropOuts }} DROPOUTS
        </div>
    </div>
    <div v-else>
        <div v-if="remoteVarBusy" class="ready">
            BUSY...
        </div>
        <div v-else class="ready">
            READY TO RECORD
        </div>
    </div>
    <div class="space__indicator">
        <strong>{{ remoteVarMtkFreeSpace }}</strong> left
    </div>
    </div>
    </div>
</template>

<script>
/* TODO: don't show "ready to record" in case no usb-stick/harddisk is attached to the mixer */
import { mapGetters } from 'vuex'
export default {
  name: 'RecStatus',
  props: {
    content: String,
    dataKeys: Array,
    socketId: String
  },
  data: function () {
    return {
      state: false
    }
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    remoteButtonState () {
      // console.log(this.readSpecificRemoteMixerValue(this.dataKeys[0]));
      return this.readSpecificRemoteMixerValue('var.mtk.rec.currentState')
    },
    stateClass () {
      return (this.state === true) ? 'active' : ''
    },
    remoteVarSession () {
      return this.readSpecificRemoteMixerValue('var.mtk.rec.session')
    },
    remoteVarBusy () {
      return this.readSpecificRemoteMixerValue('var.mtk.rec.busy')
    },
    remoteVarTime () {
      return this.readSpecificRemoteMixerValue('var.mtk.rec.time')
    },
    remoteVarMtkCurrentState () {
      return this.readSpecificRemoteMixerValue('var.mtk.currentState')
    },
    remoteVarMtkBufferFill () {
      return this.readSpecificRemoteMixerValue('var.mtk.bufferfill')
    },
    remoteVarMtkFreeSpace () {
      const space = parseFloat(this.readSpecificRemoteMixerValue('var.mtk.freespace')).toFixed(2)
      return (space) < 0 ? '???' : `${space} GB`
    },
    remoteVarMtkDropOuts () {
      return this.readSpecificRemoteMixerValue('var.mtk.dropouts')
    },
    bufferBarWidth () {
      return `width: ${this.remoteVarMtkBufferFill * 100}%`
    }

  },
  methods: {

    readSpecificRemoteMixerValue (keyArg) {
      return this.readRemoteMixerValue({ socketId: this.socketId, key: keyArg })
    },
    formatSeconds (seconds) {
      const minutes = Math.floor(seconds / 60)
      const sec = seconds % 60
      return ((minutes < 10) ? '0' : '') + minutes + ':' + ((sec < 10) ? '0' : '') + sec
    },
    sendRecStatusToAllFrames () {
      if (window.parent === window.self) {
        // no embedded frame
        return
      }
      // console.log('window.parent.frames', window.parent.frames)
      for (let f = 0; f < window.parent.frames.length; f++) {
        if (window.parent.frames[f] === window.self) {
          continue
        }
        try {
          window.parent.frames[f].postMessage(
            {
              rec: this.state === true,
              sec: this.state === true
                ? this.formatSeconds(this.remoteVarTime)
                : '00:00'
            },
            '*'
          )
        } catch (e) {

        }
      }
    }
  },
  watch: {
    remoteButtonState () {
      // console.log("watch.remoteButtonState() changed to ", this.remoteButtonState)
      this.state = (parseInt(this.remoteButtonState) === 1)
    },
    remoteVarTime () {
      this.sendRecStatusToAllFrames()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.rec__status {
    color:#ffffff;
    font-size: 1em;
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
    width: 200px;
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
}
.rec__status-active {
  box-shadow:inset 0px 1px 0px 0px #f5978e;
  background:linear-gradient(to bottom, #f24537 5%, #c62d1f 100%);
  background-color:#f24537;
  border:1px solid #d02718;

}

.rec__time {
  font-size: 3em;
  font-weight: bold;
}

.ready {
  font-size: 2em;
  font-weight: bold;
}

.rec__buffer {
  width: 90%;
  height: 10px;
  border: 1px solid black;
  position: absolute;
  top: 10%;
  left: 5%;
}

.rec__buffer-bar {
  height: 100%;
  background: black;
}

.space__indicator {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}

.dropout {
  font-weight: bold;
  font-size: 1.3em;
  padding: 0.5em;
  color: #f24537;
  background-color: black;
  position: absolute;
  z-index: 2;
  top: 20%;
  left: 5%;
  width: 80%;
}
</style>
