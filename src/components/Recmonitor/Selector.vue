<template>
  <div class="recmonitor__selector">
    <h2>Rec-monitor</h2>
    <p>non-interactive GUI to keep track of the multitrack recording feature<br>
    select the mixer instance</p>
    <ul class="nav">
      <li v-for="(item, index) in enabledSocketKeys" v-bind:key="index">
          <router-link :to="{ name: 'RecmonitorShow', params: { socketId: item }}" class="btn">
          {{ item }}
          </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Home' }" class="btn">back to menu</router-link>
      </li>
    </ul>
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
