<template>

  <div class="vumeter__container">
    <div class="labeled__vumeter labeled__vumeter-unarmed" v-if="currentArmedChannels.length === 0">
        No channels armed for recording
    </div>
    <LabeledVuMeter
        v-for="(item, index) in currentArmedChannels"
        v-bind:dataKeys="item"
        v-bind:key="index"
    ></LabeledVuMeter>
    <LabeledVuMeter :dataKeys="['m.0.mix','m.1.mix']" staticLabel="MASTER"/>
    <RecStatus />
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
import LabeledVuMeter from './LabeledVuMeter.vue'
import RecStatus from './RecStatus.vue'
export default {
    name: 'RecMonitor',
    components: {
        LabeledVuMeter,
        RecStatus
    },
    props: {
        armedChannels: Array
    },
    computed: {
        ...mapGetters([
        'readRemoteMixerValue'
        ]),
        remoteArmedChannels() {
            // concatenate all relevant values that affect the vu meters
            let paramChunk = "";
            // we have to observe i.[0-19].mtkrec  l.[0-1].mtkrec
            for (let inputIndex of [...Array(20)].keys()) {
                if(inputIndex < 2) {
                    // line inputs have another key in recording config
                    paramChunk += `-l.${inputIndex}.r-` + this.readRemoteMixerValue(`l.${inputIndex}.mtkrec`)
                    paramChunk += `-l.${inputIndex}.s-` + this.readRemoteMixerValue(`l.${inputIndex}.stereoIndex`)
                }
                paramChunk += `-i.${inputIndex}.r-` + this.readRemoteMixerValue(`i.${inputIndex}.mtkrec`)
                paramChunk += `-i.${inputIndex}.s-` + this.readRemoteMixerValue(`i.${inputIndex}.stereoIndex`)
            }
            return paramChunk;
        },
        currentArmedChannels() {
            return this.updateArmedChannels();
        }
    },
    methods: {
        updateArmedChannels() {
            let visibleVus = [];
            let currentVuPair;
            for (let inputIndex of [...Array(20)].keys()) {
                currentVuPair = this.checkChannelArmed("i", inputIndex);
                if(currentVuPair !== null) {
                    visibleVus.push(currentVuPair)
                }
            }
            for (let inputIndex of [...Array(2)].keys()) {
                currentVuPair = this.checkChannelArmed("l", inputIndex);
                if(currentVuPair !== null) {
                    visibleVus.push(currentVuPair)
                }
            }
            return visibleVus;
        },
        checkChannelArmed(channelLetter, channelIndex) {
            if (this.readRemoteMixerValue(`${channelLetter}.${channelIndex}.mtkrec`) === 0) {
                // skip channels that are not armed for recording
                return null;
            }
            let stereoIndex = this.readRemoteMixerValue(`${channelLetter}.${channelIndex}.stereoIndex`);


            if (stereoIndex === 1) {
                return null;
            }
            if (stereoIndex === -1) {
                // add mono
                return (channelLetter === "l") ? [`l.${channelIndex}.${channelIndex}`] : [channelIndex]
            }
            //  add stereo
            return (channelLetter === "l")
                ? [`l.${channelIndex}.${channelIndex}`, `l.${channelIndex+1}.${channelIndex+1}`]
                : [channelIndex, channelIndex+1]
        }
    },
    watch: {
        remoteArmedChannels() {
            //console.log("watch.remoteArmedChannels() changed to ", this.remoteArmedChannels)
            this.updateArmedChannels()
        }
    },
    mounted(){
        this.updateArmedChannels()
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.vumeter__container {
  display: flex;
  height: 80%;
}

.vumeter__container .strip__label{
  display: block;
  text-align: center;
  width: calc(100% - 20px);
  bottom: 20%;
  font-size: 1.2em;
}

.labeled__vumeter-unarmed {
    color: #FFF;
    font-size: 3em;
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
}

</style>
