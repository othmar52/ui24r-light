<template>
  <div class="hello">
    <ConnectionStatusAll />
    <h1>main menu</h1>
    <ul>
      <li>
        <a href="#recmonitor">recmonitor</a>
      </li>
    </ul>
  </div>
</template>

<script>
import ConnectionStatusAll from '@/components/ConnectionStatusAll.vue'
export default {
  name: 'MixerIp',
  components: {
    ConnectionStatusAll
  },
  props: {
    msg: String
  },

  methods: {
    connectToSocket: function () {
      console.log('connect to socket()')
      this.$store.dispatch('mixerSocketConnect', 'dhdh')
      //    this.active = this.active ? false : true;
      //    this.$store.dispatch('setFilter', this)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
