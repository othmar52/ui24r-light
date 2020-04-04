<template>
  <div class="strip__label" >{{ label }}</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'StripLabel',
  props: {
    labelKey: String,
    staticText: String,
    socketId: String
  },
  computed: {
    ...mapGetters([
      'readRemoteMixerValue'
    ]),
    label () {
      // console.log("fyghsff", this.staticText, this.labelKey)
      if (typeof this.staticText !== 'undefined') {
        return this.staticText
      }
      return this.postProcessLabel(
        this.readRemoteMixerValue({
          socketId: this.socketId,
          key: this.labelKey
        }),
        this.labelKey
      )
    }
  },
  methods: {
    /* TODO: add channel suffix by configuration. respect stereoLink */
    postProcessLabel (labelString, labelKey) {
      if (labelString === '') {
        return labelKey.replace('.name', '')
      }
      return labelString
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.strip__label {
    position: absolute;
    bottom: -2em;
    text-align: center;
    color: white;
    font-weight: bold;
    width: 100%;

}
</style>
