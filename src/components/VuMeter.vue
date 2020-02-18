<template>
  <div class="hello" :style="`width: ${vuInPercent}%;`">
  <h1></h1>
  <p>xxx:  <span v-if="vuInPercent">
    aa
    </span>
</p>
  </div>
</template>

<script>
import  { mapState, mapGetters } from 'vuex'
export default {
  name: 'VuSlider',
  props: {
    keyVuIn: String,
    keyVuOut: String
  },
  computed: {
    ...mapGetters([
      'getMixerValue'
    ]),
    vuInPercent() {
      return this.getVuPercent(this.keyVuIn);
    },
    vuOutPercent() {
      return this.getVuPercent(this.keyVuOut);
    }
  },
  methods: {
     getVuPercent(vuKey) {
        let vuPre = this.getMixerValue(vuKey);
        return (typeof vuPre !== "undefined")
          ? vuPre.pre*100* this.$store.getters.getCurSetup.zeroDbPos
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

.hello {
   background: red;
   border: 1px solid blue;
   height: 100px;
   width: 20%;
}
</style>
