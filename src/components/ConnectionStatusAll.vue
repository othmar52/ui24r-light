<template>
  <div class="connection__status">
    <ConnectionStatus v-for="(socketId, idx) in socketIds" v-bind:key="idx" v-bind:socketId="socketId"/>
  </div>
</template>

<script>
import ConnectionStatus from '@/components/ConnectionStatus.vue'
export default {
  name: 'ConnectionStatusAll',
  components: {
    ConnectionStatus
  },
  data () {
    return {
      socketIds: ['mixer1', 'mixer2', 'paramRecorder1', 'paramRecorder2']
    }
  }
}
</script>
<style>
.connection__status {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
}
</style>
