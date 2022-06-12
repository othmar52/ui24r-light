<template>
  <div class="page page--midicc">
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'MatrixMixerShow' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        Documentation
      </h2>
      <nav class="nav nav--subnav">
      </nav>
    </header>
    <nav class="nav nav--scrollnav">
      <div v-for="(csvInstance, csvIndex) of csvFiles" v-bind:key="csvIndex+1122"
          class="btn"
          @click="scrollToSection"
          :data-section="`#section-${csvIndex}`">
          {{csvInstance.header}}<br>
      </div>
      <div class="btn" @click="scrollToSection" data-section="#section-linnpresets">
          Linnstrument Settings<br>
      </div>
    </nav>

    <NoteSignalFlow width="600" />

    <div v-if="fetchedData">
      <div v-for="(csvInstance, csvIndex) of csvFiles" v-bind:key="csvIndex+777">
        <h2 :id="`section-${csvIndex}`">
          {{csvInstance.header}}
          <span class="link--top" @click="scrollToSection" data-section="body" v-if="csvIndex > 0">to top</span>
        </h2>
        <table class="table table--fullwidth">
          <tr class="tr">
            <th v-for="(csvField, index) in csvInstance.headerRow" v-bind:key="index+999" class="td">
                {{csvField}}
            </th>
          </tr>
          <tr v-for="(csvLine, index) in csvInstance.dataRows" v-bind:key="index+3383" class="tr">
            <td v-for="(csvField, index1) in csvLine" v-bind:key="index1+7778" class="td">
              <ColorCodes v-if="csvInstance.colorCodeColumns.includes(index1)" :colorsString="csvField" />
              <div v-else-if="csvInstance.colorByInputChannelColumns.includes(index1)" :class="`color-${getColorIndexForInputChannel(index)}`">
                {{csvField}}
              </div>
              <div v-else-if="csvInstance.colorByOutputChannelColumns.includes(index1)" :class="`color-${getColorIndexForOutputChannel(index)}`">
                {{csvField}}
              </div>
              <div v-else>
                {{csvField}}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <h2 id="section-linnpresets">
        Linnstrument Settings
        <span class="link--top" @click="scrollToSection" data-section="body">to top</span>
      </h2>
      <div class="linn_presets">
        <h3>Left split</h3>
        <!--img width="90%" src="../../assets/img/linnstument/IMG_8549.jpg" /><br /-->
        <Linnstrument :matrix="[
          '   ggg ggggg  g',
          'gggggg g  b',
          '        ggr',
          '      ggg y'
        ]"/>
        <!--img width="90%" src="../../assets/img/linnstument/IMG_8550.jpg" /><br /-->
        <Linnstrument :matrix="[
          ' gg    ggggg  g',
          'g      g  b',
          '        ggr',
          '      ggg y'
        ]"/>
        <h3>Right split</h3>
        <!--img width="90%" src="../../assets/img/linnstument/IMG_8551.jpg" /><br /-->
        <Linnstrument :matrix="[
          'b      bbbbb   b',
          ' b     b  t  b',
          '  bbbb  bbp',
          '  bbb bbb y'
        ]"/>
        <!--img width="90%" src="../../assets/img/linnstument/IMG_8552.jpg" /><br /-->
        <Linnstrument :matrix="[
          'bbb    bbbbb   b',
          '       b  t  b',
          '        bbp',
          '      bbb y'
        ]"/>
        <p>cc<strong>12</strong> - cc<strong>19</strong> (bottom to top)</p>
        <!--img width="90%" src="../../assets/img/linnstument/IMG_8553.jpg" /><br /-->
        <Linnstrument :matrix="[
          '               b        b',
          '      b  bb             b',
          '     bb b  b            b',
          '      b   b             b',
          '      b  b              b',
          '      b b               b',
          '      b bbbb            b',
          '                        y'
        ]"/>
      </div>
    </div>
    <h2>
      <span class="link--top" @click="scrollToSection" data-section="body">to top</span>
    </h2>

  </div>
</template>

<script>
/* eslint-disable no-multi-spaces */
import { mapGetters } from 'vuex'
import * as Papa from 'papaparse'
import ColorCodes from '@/components/User1/ColorCodes.vue'
import Linnstrument from '@/components/Linnstrument/Linnstrument.vue'
import NoteSignalFlow from '@//assets/img/midi-note-signal-flow.svg'
export default {
  name: 'User1Show',
  components: {
    ColorCodes,
    NoteSignalFlow,
    Linnstrument
  },
  data () {
    return {
      amountParsedCsvs: 0,
      csvFiles: [
        {
          header: 'MIDI wiring - mioXL inputs',
          filePath: 'csv/other/midi1-mioxl-inputs.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'MIDI wiring - mioXL outputs',
          filePath: 'csv/other/midi2-mioxl-outputs.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'MIDI(USB) wiring - mioXL USB host',
          filePath: 'csv/other/midi3-mioxl-usbhost.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'MIDI wiring - Kenton THRU-5 outputs',
          filePath: 'csv/other/midi4-kenton-outputs.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'MIDI wiring - Miditech Thru 4 outputs (isolated clock)',
          filePath: 'csv/other/midi5-miditech-outputs.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'MIDI Notes main input chain',
          filePath: 'csv/other/midi6-notes-input-chain.csv',
          colorCodeColumns: [2, 3],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'Audio wiring - Ui24R inputs / Patchbay 1 (upper)',
          filePath: 'csv/other/patchbay-inputs.csv',
          colorCodeColumns: [1, 4],
          colorByInputChannelColumns: [0, 5],
          colorByOutputChannelColumns: []
        },
        {
          header: 'Audio wiring - Ui24R outputs / Patchbay 2 (lower)',
          filePath: 'csv/other/patchbay-outputs.csv',
          colorCodeColumns: [1, 4],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: [0, 5]
        },
        {
          header: 'Firmware',
          filePath: 'csv/other/firmware.csv',
          colorCodeColumns: [],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        },
        {
          header: 'Low voltage power supply (plugs and polarity)',
          filePath: 'csv/other/low-voltage.csv',
          colorCodeColumns: [],
          colorByInputChannelColumns: [],
          colorByOutputChannelColumns: []
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getColorIndexForInputChannel',
      'getColorIndexForOutputChannel'
    ]),
    fetchedData () {
      return this.amountParsedCsvs === this.csvFiles.length
    }
  },
  mounted () {
    const that = this
    for (const csvFile of this.csvFiles) {
      const parseConfig = {
        download: true,
        delimiter: ',',
        complete: function (results) {
          csvFile.headerRow = results.data.shift()
          csvFile.dataRows = results.data
          that.amountParsedCsvs++
        }
      }
      Papa.parse(
        csvFile.filePath,
        parseConfig
      )
    }
  },
  methods: {
    scrollToSection (event) {
      this.$scrollTo(event.currentTarget.dataset.section)
    }
  },
  created () {
    // console.log(this.$papa)
  }
}

</script>
