<template>
  <div class="vumeter" >
    <div class="vumeter__in" :style="`width: ${vuInPercent}%;`"></div>
    <div class="vumeter__out" :style="`width: ${vuOutPercent}%;`"></div>
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
export default {
  name: 'VuMeter',
  props: {
    keyVu: String
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    vuInPercent() {
      return this.getVuPercent(this.keyVu, 'pre');
    },
    vuOutPercent() {
      return this.getVuPercent(this.keyVu, 'post');
    }
  },
  methods: {
     getVuPercent(vuKey, subKey) {
        let vuPre = this.readRemoteMixerValue(vuKey);
        return (typeof vuPre !== "undefined")
          ? vuPre[subKey]*100* this.$store.getters.getCurSetup.zeroDbPos
          : 0;
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.vumeter {
   position: relative;
   height: 100px;
   width: 100%;
}

.vumeter__in,
.vumeter__out {
  width: 100%;
  height: 100%;
  position: absolute;
}

.vumeter__in {
  background: red;
}
.vumeter__out {
  background: blue;
}
</style>
