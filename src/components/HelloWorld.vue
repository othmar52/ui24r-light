<template>
  <div class="hello" :style="`width: ${w}%;`">
  <h1>mKey: {{ mKey }}</h1>
  <p>xxx:  <span v-if="asfdg">
    {{asfdg}}
    </span>
</p>
  </div>
</template>

<script>
import  { mapState, mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  props: {
    w: String,
    mKey: String
  },
  computed: {
    ...mapGetters([
      'getMixerValue'
    ]),
    asfdg() {
      console.log(this.mKey, "--------")
      let vuPre = this.getMixerValue(this.mKey);
      return (typeof vuPre !== "undefined") ? vuPre.pre : "undef";
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
