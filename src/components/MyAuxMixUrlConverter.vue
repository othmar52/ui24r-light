<template>
  <MyAuxMix
    :socketId="socketId"
    :myInputChannels="myInputChannels"
    :myAuxChannel="myAuxChannel"
  />
</template>

<script>
import MyAuxMix from '@/components/MyAuxMix.vue'
export default {
  name: 'MyAuxMixUrlConverter',
  components: {
    MyAuxMix
  },
  data () {
    return {
      socketId: '',
      myInputChannels: [],
      myAuxChannel: []
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
    } catch (e) {
      // console.log('invalid json url param')
      this.$router.push({ name: 'MyAuxMixConfigurator' })
    }
  }
}
</script>
