<template>
  <div id="app">
    <CreateConfig v-if="!haveValidConfig" />
    <ConnectionStatusAll v-if="haveValidConfig"  />
    <router-view v-if="haveValidConfig" />
  </div>
</template>
<script>
import CreateConfig from '@/components/config/CreateConfig.vue'
import ConnectionStatusAll from '@/components/ConnectionStatusAll.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    CreateConfig,
    ConnectionStatusAll
  },
  computed: {
    ...mapGetters({
      haveValidConfig: 'haveValidConfig'
    })
  },
  mounted () {
    if (this.haveValidConfig) {
      this.$store.dispatch('createEmptyRoute')
      this.$store.dispatch('connectAllEnabledSockets')
    }
  }
}
</script>
<style lang="scss">
@import "@/scss/main.scss";
</style>
