<template>
  <div class="auxmix__selector">
    <div class="choose__mixer">
      <h3>Choose Mixer</h3>
    </div>
    <h1>choose your channel(s)...</h1>
    <router-link :to="{ name: 'MyAuxMixShow', params: { myAuxMixUrlParams: jsonifiedParams } }">static example configuration</router-link><br>
    <router-link :to="{ name: 'Home' }">back to menu</router-link><br>
    params: {{ jsonifiedParams }} XXX
  </div>
</template>

<script>
export default {
  name: 'MyAuxMixConfigurator',
  computed: {
    jsonifiedParams () {
      const testJson = [
        'mixer1',
        [[2, 3], [7]],
        [0, 1]
      ]
      return JSON.stringify(testJson)
    }
  }
}
</script>
