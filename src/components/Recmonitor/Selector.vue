<template>
  <div class="recmonitor__selector">
    select mixer instance<br>
    <router-link
      v-for="(item, index) in enabledSocketKeys"
      v-bind:key="index"
      :to="{ name: 'RecmonitorShow', params: { socketId: item }}">
       {{ item }}
    </router-link><br>
    <router-link :to="{ name: 'Home' }">back to menu</router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RecMonitorSelector',
  computed: {
    ...mapGetters([
      'getEnabledMixerSocketIds'
    ]),
    enabledSocketKeys () {
      return this.getEnabledMixerSocketIds
    }
  },
  mounted () {
    this.checkForRedirect()
  },
  methods: {
    checkForRedirect () {
      if (this.enabledSocketKeys.length !== 1) {
        return
      }
      // forward to only available mixer but do not create a router history entry
      this.$router.replace({
        name: 'RecmonitorShow',
        params: { socketId: this.enabledSocketKeys[0] }
      })
    }
  }
}
</script>
