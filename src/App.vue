<template>
  <div id="app">
    <img alt="Vue logo" class="logo" src="./assets/logo.png">
    <VuMeterStereo keyVuLeft="i.20.mix" keyVuRight="i.21.mix" />
    <RangeSlider dataKey="i.20.mix" />
    <RangeSlider dataKey="i.21.mix" />
  </div>
</template>

<script>
//import VuMeter from './components/VuMeter.vue'
import VuMeterStereo from './components/VuMeterStereo.vue'
import RangeSlider from './components/RangeSlider.vue'

export default {
  name: 'App',
  components: {
    //VuMeter,
    VuMeterStereo,
    RangeSlider
  },
  data() {
    return {
      // client config
      ip: '10.0.1.124',
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
                this.$socket.send('3:::ALIVE')
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
.logo {
  height: 30px;
}
</style>
