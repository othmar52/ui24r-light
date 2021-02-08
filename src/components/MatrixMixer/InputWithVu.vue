<template>
  <div :class="`vuued__channel vuued__channel--input vuued__channel--${(vuEnabled) ? 'enabledvu' : 'disabledvu'}`">
    <span :class="`color-${item.color}`">
        {{ item.name }}
    </span>
    <VuMeter
        v-if="item.inputChannels.length === 1"
        :keyVu="`vu.i.${item.inputChannels[0]}.mix`"
        socketId="mixer1"
    />
    <VuMeterStereo
        v-else
        :keyVuLeft="`i.${item.inputChannels[0]}.mix`"
        :keyVuRight="`i.${item.inputChannels[1]}.mix`"
        socketId="mixer1"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import VuMeter from '@/components/VuMeter.vue'
import VuMeterStereo from '@/components/VuMeterStereo.vue'
export default {
  name: 'InputWithVu',
  components: {
    VuMeter,
    VuMeterStereo
  },
  computed: {
    ...mapGetters([
      'getVuEnabled'
    ]),
    vuEnabled () {
      return this.getVuEnabled('mixer1')
    }
  },
  props: {
    item: Object,
    data: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">

</style>
