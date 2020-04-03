<template>
  <div class="recmonitor__selector">
    rec monitor selector XXX<br>
    <router-link :to="`/recmonitor/mixer1`">mixer1</router-link><br>
    <router-link :to="`/recmonitor/mixer2`">mixer2</router-link>
  </div>
</template>

<script>
export default {
  name: 'RecmonitorSelector',
  mounted () {
    console.log('RecmonitorSelector::mounted()')
    if (typeof this.$route.params.socketId === 'undefined') {
      // return
    }
    // this.$router.push(`/recmonitor/${this.$route.params.socketId}`)
    // this.$router.push('/')

    // console.log('rec selector mounted', this.socketId, this.$route.params.socketId)
  },
  created () {
    console.log('RecmonitorSelector::created()')
  },
  watch: {
    '$route.params.socketId': function (socketId) {
      console.log('RecmonitorSelector::watcher ', socketId)
      this.show = false
      // this.$router.push(`/recmonitor/${socketId}`)
    }
  }
}
</script>
