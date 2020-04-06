<template>
  <MyAuxMix
    :socketId="socketId"
    :myInputChannels="myInputChannels"
    :myAuxChannel="myAuxChannel"
    :showRec="showRec"
    :noSleep="noSleep"
  />
</template>

<script>
import MyAuxMix from '@/components/MyAuxMix/Show.vue'
export default {
  name: 'MyAuxMixUrlConverter',
  components: {
    MyAuxMix
  },
  data () {
    return {
      socketId: '',
      myInputChannels: [],
      myAuxChannel: [],
      showRec: true,
      noSleep: true
    }
  },
  computed: {
    myAuxMixUrlParams () {
      return this.$route.params.myAuxMixUrlParams
    }
  },
  created () {
    // this.myInputChannels = [[2, 3], [7]]
    // this.myAuxChannel = [0, 1]
    let urlJson = null
    try {
      urlJson = JSON.parse(this.myAuxMixUrlParams)
      this.socketId = urlJson[0]
      this.myInputChannels = urlJson[1]
      this.myAuxChannel = urlJson[2]
      this.showRec = urlJson[3]
      this.noSleep = urlJson[4]
    } catch (e) {
      // console.log('invalid json url param')
      this.$router.push({ name: 'MyAuxMixConfigurator' })
    }
  }
}
</script>
