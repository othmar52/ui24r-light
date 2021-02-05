<template>
  <div @click="triggerAction">
    <span v-if="delayActive">sure?</span>
    <span v-else v-html="markup"></span>
  </div>
</template>

<script>
export default {
  name: 'DelayedTrigger',
  data () {
    return {
      delayActive: false
    }
  },
  props: {
    markup: String
  },
  methods: {
    triggerAction () {
      if (this.delayActive === false) {
        this.delayActive = true
        const that = this
        setTimeout(function () { that.delayActive = false }, 2000)
        return
      }
      this.delayActive = false
      this.$emit('actionTriggered')
    }
  }
}
</script>

<style lang="scss">

</style>
