<template>
  <div class="hello">
    <h1>main menu</h1>
    <ul>
      <li>
        <router-link :to="{ name: 'RecmonitorSelector' }">Rec-monitor</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'MyAuxMixConfigurator' }">My AUX mix</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    msg: String
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
