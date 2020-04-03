<template>
  <div class="recmonitor__view">
    <RecmonitorSelector v-if="!socketId" />
    <Recmonitor v-else v-bind:socketId="socketId" />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import RecmonitorSelector from '@/components/RecmonitorSelector.vue'
import Recmonitor from '@/components/Recmonitor.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'RecmonitorView',
  data () {
    return {
      socketId: ''
    }
  },
  props: {
    sockXXXetId: String
  },
  components: {
    RecmonitorSelector,
    Recmonitor
  },
  computed: {
    ...mapGetters({
      haveValidConfig: 'haveValidConfig'
    })
  },
  mounted () {
    // console.log('RecmonitorView::mounted()')
    if (typeof this.$route.params.socketId === 'undefined') {
      return
    }
    // this.$router.push('Home')
    this.socketId = this.$route.params.socketId

    // console.log('rec selector mounted: ', this.socketId)
  },
  created () {
    // console.log('RecmonitorView::created()')
  },
  watch: {
    '$route.params.socketId': function (socketId) {
      // console.log('watcher ', socketId)
      // this.$router.push(`/recmonitor/${socketId}`)
    }
  }
}
</script>

<style>
.recmonitor__view {
  height: 100%;
}
</style>
