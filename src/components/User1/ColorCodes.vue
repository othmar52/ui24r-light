<template>
  <div class="colorcodes">
    <div v-for="(colorString, index) in colorsArray" v-bind:key="index+777" :class="`color-${colorString}`"> </div>
  </div>
</template>

<script>
export default {
  name: 'ColorCodes',
  components: {
    // NotesColumn
  },
  data () {
    return {
      colorsArray: []
    }
  },
  props: {
    colorsString: String
  },
  computed: {
    deviceId () {
      return this.$route.params.deviceId
    }
  },
  mounted () {
    this.colorsArray = this.colorsString.split(';')
  },
  methods: {

  },
  created () {
    // console.log(this.$papa)
  }
}

</script>
