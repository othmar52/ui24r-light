<template>
  <div class="vuued__channel vuued__channel--output">
    <span :class="`color-${item.color}`">
        {{ item.name }}
    </span>
    <VuMeter
        v-if="item.outputChannels.length === 1"
        :keyVu="`vu.a.${item.outputChannels[0]}.mix`"
        socketId="mixer1"
    />
    <VuMeterStereo
        v-else
        :keyVuLeft="`a.${item.outputChannels[0]}.mix`"
        :keyVuRight="`a.${item.outputChannels[1]}.mix`"
        socketId="mixer1"
    />
  </div>
</template>

<script>

import VuMeter from '@/components/VuMeter.vue'
import VuMeterStereo from '@/components/VuMeterStereo.vue'
export default {
  name: 'OutputWithVu',
  components: {
    VuMeter,
    VuMeterStereo
  },
  props: {
    item: Object
  }
}
</script>

<style lang="scss">

</style>
