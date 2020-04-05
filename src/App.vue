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
      this.$store.dispatch('connectAllEnabledSockets')
    }
  }
}
</script>
<style lang="scss">
@import '~pretty-checkbox/src/pretty-checkbox.scss';
html,
body,
#app {
  height: 100%;
}
body {
  background: #222229;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 0;
}

a {
  color: white;
  text-decoration: none;
}

.btn {
  background-color: #6b6b88;
  padding: 1em;
}
.btn:hover {
  background-color: #7676a7;
}

.nav {
  display: flex;
  list-style-type: none;
  padding: 0;

  li {
    flex-grow: 1;
    flex-shrink: 1;
    padding: 3px;
    display: flex;
  }

  a {
    font-weight: bold;
    font-size: 1.5em;
    color: white;
    display: inline-block;
    margin: 2px;
    flex-grow: 1;
    flex-shrink: 1;

    p {
      font-weight: normal;
      color: #333;
      font-size: 0.7em;
    }
  }
}
</style>
