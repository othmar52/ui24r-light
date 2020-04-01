<template>
  <div id="app">
    <Overlay text="Connecting..." />
    <!-- <SliderContainer :rangeSlidersVu="rangeSlidersVu" /> -->
    <!--
    <ButtonRec :dataKeys="['var.mtk.rec.currentState']" content="REC" />
    <MyAuxMix :myInputChannels="[[2,3],[7]]" :myAuxChannel="[0,1]" />
    -->
    <RecMonitor />
  </div>
</template>

<script>
import VuMeter from './components/VuMeter.vue'
import VuMeterStereo from './components/VuMeterStereo.vue'
import RangeSlider from './components/RangeSlider.vue'
import RangeSliderVu from './components/RangeSliderVu.vue'
import SliderContainer from './components/SliderContainer.vue'
import ButtonRec from './components/ButtonRec.vue'
import MyAuxMix from './components/MyAuxMix.vue'
import RecMonitor from './components/RecMonitor.vue'
import Overlay from './components/Overlay.vue'

export default {
  name: 'App',
  components: {
    Overlay,
    ButtonRec,
    MyAuxMix,
    RecMonitor,
    VuMeter,
    VuMeterStereo,
    RangeSlider,
    RangeSliderVu,
    SliderContainer
  },
  data() {
    return {
      // client config
      ip: '10.0.1.126',

      rangeSlidersVu: [
        ['i.0.mix','i.1.mix'],
        ['i.2.mix','i.3.mix'],
        ['i.4.mix','i.5.mix'],
        ['i.6.mix'],
        ['i.7.mix'],
        ['i.8.mix','i.9.mix'],
        ['i.10.mix'],
        ['i.11.mix'],
        ['i.12.mix','i.13.mix'],
        ['i.14.mix'],
        ['i.15.mix'],
        ['i.16.mix','i.17.mix'],
        ['i.18.mix','i.19.mix'],
        ['i.20.mix','i.21.mix']
      ],

      subscriptions: [],
      linkedSubscriptions: {},
      backgroundSubscriptions: [],

      me: {
          inputs: [6, 20, 9],
          aux: [2]
      },

      // singletons
      store: null,
      sock: null,
      keepAliveInterval: null,
      // parser: new Parser(),

      // mixer constants
      zeroDbPos: .7647058823529421,
      curSetup: {
          input: 24,
          linein: 2,
          fx: 4,
          aux: 10,
          sub: 6,
          rec: true,
          // TODO: below variables can be removed, right?
          bankSize: 8,
          maxx: false,
          phantom: 20,
          uniqueid: '8100C00220460094148085785103303C'
      },

      // realtime mixer values
      vu: {}, // realtime levels of audio signals
      mData: {} // fader values, button states, etc.
  }
  },
  mounted() {
      //this.$options.sockets.onmessage = (data) => console.log(data.data)


      this.$options.sockets.onopen = () => {
          this.keepAliveInterval = setInterval(() => {
              this.$store.dispatch('sendMixerCommand', 'ALIVE')
          }, 1000);
      }

      this.$options.sockets.onclose = () => {
          clearInterval(this.keepAliveInterval)
      }
      this.$connect(`ws://${this.ip}/socket.io/1/websocket/sock-${(new Date).getTime()}${(new Date).getMilliseconds()}`)

  },
  methods: {

    log(data) {
        console.log(data);
    }

  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
body {
  background: #3D3D4A;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
