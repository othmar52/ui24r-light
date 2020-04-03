<template>
  <div id="app">
    <CreateConfig v-if="!haveValidConfig" />
    <ConnectionStatusAll />
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
      this.$store.dispatch('connectAllEnabledSockets')
    }
  },

  methods: {
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

html,
body,
#app {
  height: 100%;
}
body {
  background: #3D3D4A;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
