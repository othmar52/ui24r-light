<template>
  <div id="app" data-fut="beidl">
    <img alt="Vue logo" src="./assets/logo.png">
    <VuSlider w="50" mKey="myTestKey" />
  </div>
</template>

<script>
import VuSlider from './components/VuSlider.vue'

export default {
  name: 'App',
  components: {
    VuSlider
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
      testInterval: null,
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

      this.testInterval = setInterval(() => {
           let uniqueVar = (new Date).getTime() +"."+ (new Date).getMilliseconds();
           //console.log("committingxxx", uniqueVar)
           this.$store.commit(
             'updateMixerData',
             {
               key: `myTestKey`,
               data: { pre: uniqueVar }
            }
          )
      }, 1000);


      console.log(this.$options)


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
  margin-top: 60px;
}
</style>
