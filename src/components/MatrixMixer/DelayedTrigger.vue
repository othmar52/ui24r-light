<template>
  <div @click="triggerAction" class="trigger">
    <span v-if="delayActive">sure?</span>
    <span v-else>
      <span v-html="markup" v-if="markup"></span>
      <span v-if="iconIdentifier" :class="`icon icon--${iconIdentifier}`">
        <IconTrash v-if="iconIdentifier === 'trash'" />
        <IconX v-if="iconIdentifier === 'x'" />
      </span>
    </span>
  </div>
</template>

<script>

import IconTrash from '@/assets/img/trash.svg'
import IconX from '@/assets/img/x.svg'
export default {
  name: 'DelayedTrigger',
  components: {
    IconTrash,
    IconX
  },
  data () {
    return {
      delayActive: false
    }
  },
  props: {
    markup: String,
    iconIdentifier: {
      type: String,
      default: null
    }
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
