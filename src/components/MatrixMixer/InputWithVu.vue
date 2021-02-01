<template>
  <div class="vuued__channel vuued__channel--input">
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

import VuMeter from '@/components/VuMeter.vue'
import VuMeterStereo from '@/components/VuMeterStereo.vue'
export default {
  name: 'InputWithVu',
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
.vuued__channel {
    min-width: 160px;
    height: 100px;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-wrap: wrap;
    &>span {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        width: calc(100% - 30px);
    }
    &>.vumeter,
    &>.vumeter__stereo {
        width: 30px;
    }
}
</style>
