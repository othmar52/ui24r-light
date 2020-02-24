<template>
  <div class="slider__container">
    <!-- headphone(aux) volume -->
    <RangeSliderVu :dataKeys="auxDataKeys" additionalClass="auxvolume"/>

    <!-- single fader for group (all others) in headphone(aux) mix -->
    <div class="range__slider-group">
        <RangeSliderGroupMix staticLabel="group" :myInputChannels="myInputChannels" :myAuxChannel="myAuxChannel"/>
    </div>

    <!-- levels of myChannels for headphone(aux) mix -->
    <RangeSliderVu
        v-for="(item, index) in inputDataKeysAuxMix"
        v-bind:dataKeys="item"
        v-bind:key="index"
    ></RangeSliderVu>

    <!-- levels of myChannels for master mix -->
    <RangeSliderVu
        v-for="(item, index) in inputDataKeysMasterMix"
        v-bind:dataKeys="item"
        v-bind:key="index+100"
    ></RangeSliderVu>
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
import RangeSliderVu from './RangeSliderVu.vue'
import RangeSliderGroupMix from './RangeSliderGroupMix.vue'
export default {
    name: 'MyAuxMix',
    components: {
        RangeSliderVu,
        RangeSliderGroupMix
    },
    props: {
        myInputChannels: Array,
        myAuxChannel: Array
    },
    computed: {
        ...mapGetters([
        'readRemoteMixerValue'
        ]),
        auxDataKeys() {
            let keys = [];
            for(let index in this.myAuxChannel) {
                keys.push(`a.${index}.mix`)
            }
            return keys;
        },
        inputDataKeysAuxMix() {
            let allSources = [];
            for(let inputSources of this.myInputChannels) {
                let singleSource = [];
                for(let channelIndex of inputSources) {
                    for(let auxIndex of this.myAuxChannel) {
                        singleSource.push(`i.${channelIndex}.aux.${auxIndex}.value`)
                    }
                }
                allSources.push(singleSource)
            }
            //console.log(allSources)
            return allSources;
        },
        inputDataKeysMasterMix() {
            let allSources = [];
            for(let inputSources of this.myInputChannels) {
                let singleSource = [];
                for(let channelIndex of inputSources) {
                    singleSource.push(`i.${channelIndex}.mix`)
                }
                allSources.push(singleSource)
            }
            //console.log(allSources)
            return allSources;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.slider__container {
  display: flex;
  height: 80vh;
}

.range__slider-group {
  display: flex;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
}

.auxvolume {
    max-width: 3em;
}

</style>
