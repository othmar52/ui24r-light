<template>
  <div class="recmonitor">
    rec monitor for {{ socketId }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RecMonitor',
  props: {
    socketId: String
  },
  computed: {
    ...mapGetters({
      haveValidConfig: 'haveValidConfig'
    })
  },
  mounted () {
    console.log('RecMonitor::mounted()')
  },
  created () {
    console.log('RecMonitor::created()')
  }
}
</script>
