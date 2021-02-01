<template>
  <div>
    <h2>Custom faders</h2>
    <p>choose which elements (faders, buttons, etc.) you want to be shown.</p>
    <h3>not implemented yet</h3>
    <ul class="nav">
      <li>
        <router-link :to="{ name: 'Home' }" class="btn">back to menu</router-link>
      </li>
    </ul>
    <div class="vutest">
      <LabeledVuMeter :dataKeys="['i.0.mix','i.1.mix']" socketId="mixer1" staticLabel="digitakt"/>
      <LabeledVuMeter :dataKeys="['a.0.mix','a.1.mix']" socketId="mixer1" staticLabel="ST1"/>
    </div>
  </div>
</template>

<script>
import LabeledVuMeter from '@/components/LabeledVuMeter.vue'
export default {
  components: {
    LabeledVuMeter
  },
  name: 'CustomFadersConfigurator'
}
</script>

<style lang="scss">
.vutest {
  display: flex;

  .labeled__vumeter {
    border: 1px solid red;
    height: 200px;
    width: 100px;
  }
}
</style>
