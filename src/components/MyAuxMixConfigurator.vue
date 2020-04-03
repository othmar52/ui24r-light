<template>
  <div class="auxmix__selector">
    aux mix configurator<br>
    <router-link :to="{ name: 'MyAuxMixShow', params: { socketId: 'mixer2', myInputChannels: [[2, 3], [7]], myAuxChannel: [0, 1] }}">c1</router-link><br>
    <router-link :to="{ name: 'Home' }">back to menu</router-link>
  </div>
</template>

<script>
export default {
  name: 'MyAuxMixConfigurator'
}
</script>
