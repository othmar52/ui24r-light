<template>
  <div class="labeled__vumeter" :class="`labeled__vumeter-color-${readRemoteColorIndex} ${additionalClass}`">
    <VuMeter :keyVu="`vu.${keyLeft}`" v-if="dataKeys.length === 1" />
    <VuMeterStereo :keyVuLeft="`${keyLeft}`" :keyVuRight="keyRight" v-else/>
    <StripLabel :labelKey="fullLabelKey" :staticText="staticLabel" />
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
import VuMeter from './VuMeter.vue'
import VuMeterStereo from './VuMeterStereo.vue'
import StripLabel from './StripLabel.vue'
export default {
    name: 'LabeledVuMeter',
    components: {
        VuMeter,
        VuMeterStereo,
        StripLabel
    },
    props: {
        dataKeys: Array,
        labelKey: String,
        staticLabel: String,
        additionalClass: String
    },
    computed: {
        ...mapGetters([
            'readRemoteMixerValue'
        ]),
        keyLeft() {
            return (typeof this.dataKeys[0] === "string") ? this.dataKeys[0] : `i.${this.dataKeys[0]}.mix`;
        },
        keyRight() {
            return (typeof this.dataKeys[1] === "string") ? this.dataKeys[1] : `i.${this.dataKeys[1]}.mix`;
        },
        fullLabelKey() {
            return (typeof this.dataKeys[0] === "string") ? this.dataKeys[0] : `i.${this.dataKeys[0]}.name`;
        },
        readRemoteColorIndex() {
            let found = this.keyLeft.match(/i\.(\d.*)\./)
            if(found) {
                return this.readRemoteMixerValue(`i.${found[1]}.color`);
            }
            return undefined
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.labeled__vumeter {
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
  position: relative;
}


      /* 1-11 are ui24r's colors, 12-16 are custom script extended colors */
.labeled__vumeter-color-1 .strip__label  { background-color: #111111; }
.labeled__vumeter-color-2 .strip__label  { background-color: #8B0000; }
.labeled__vumeter-color-3 .strip__label  { background-color: #FF0000; } /* red */
.labeled__vumeter-color-4 .strip__label  { background-color: #FFA500; }
.labeled__vumeter-color-5 .strip__label  { background-color: #FFFF00; color: #444;} /* yellow */
.labeled__vumeter-color-6 .strip__label  { background-color: #56DE43; color: #444;} /* green */
.labeled__vumeter-color-7 .strip__label  { background-color: #0091C2; } /* lightblue */
.labeled__vumeter-color-8 .strip__label  { background-color: #9400D3; }
.labeled__vumeter-color-9 .strip__label  { background-color: #808080; }
.labeled__vumeter-color-10 .strip__label  { background-color: #FFFFFF; }
.labeled__vumeter-color-11 .strip__label  { background-color: #FF1493; }
.labeled__vumeter-color-12 .strip__label  { background-color: #00FFFF; }
.labeled__vumeter-color-13 .strip__label  { background-color: #009688; }
.labeled__vumeter-color-14 .strip__label  { background-color: #3a4caf; }
.labeled__vumeter-color-15 .strip__label  { background-color: #966100; } /* brown */
.labeled__vumeter-color-16 .strip__label  { background-color: #ff9800; color: #333;} /* orange */
.labeled__vumeter-color-undefined .strip__label  { background-color: #000;} /* black */

</style>
