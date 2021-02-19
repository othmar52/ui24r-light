<template>
  <div class="page page--midicc">
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'MatrixMixerShow' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        CC TABLES for
        <span v-if="processedCsv">{{csvData.data[1][0]}} - {{csvData.data[1][1]}}</span>
      </h2>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'DeviceList' }" class="color--spot">
          all cc tables
        </router-link>
      </nav>
    </header>
    <div v-if="processedCsv">
      <nav class="nav nav--scrollnav" v-if="groups.length > 1">
         <div
           v-for="(groupName, index) in groups"
           v-bind:key="index+11"
           class="btn"
           @click="scrollToSection"
           :data-section="`#section-${index}`"
          >
            {{groupName}} ({{dataRows[groupName].length}})
          </div>
      </nav>
      <div v-for="(groupName, index) in groups" v-bind:key="index+88" class="xx">
        <h2 :id="`section-${index}`">
          {{groupName}}
          <span class="link--top" @click="scrollToSection" data-section="body" v-if="index > 0">to top</span>
        </h2>
        <table class="table table--fullwidth">
          <tr class="tr">
            <th v-for="(header, index2) in headerRows[groupName]" v-bind:key="index2+444" class="th td">
              <div :class="index2 === 1 ? 'color--spot' : ''">{{header}}</div>
            </th>
          </tr>
          <tr v-for="(csvLine, index2) in dataRows[groupName]" v-bind:key="index2+333" class="tr">
            <td v-for="(csvField, index3) in csvLine" v-bind:key="index3+777" class="td">
              <div :class="index3 === 1 ? 'color--spot' : ''">
                <div v-if="index3 !== csvLine.length-1">{{csvField}}</div>
                <NotesColumn v-else :fieldData="csvField" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <h3>All CC data provided by <a class="color--spot" href="https://midi.user.camp/" target="_blank">MIDI CC &amp; NRPN database</a> (<a class="color--spot" href="https://github.com/usercamp/midi" target="_blank">Github</a>)</h3>
    </div>
  </div>
</template>

<script>
import * as Papa from 'papaparse'
import { mapGetters } from 'vuex'
import NotesColumn from '@/components/CcTables/NotesColumn.vue'
export default {
  name: 'CcTablesShow',
  components: {
    NotesColumn
  },
  data () {
    return {
      device: null,
      csvData: null,
      groups: [],
      groupedData: {},
      goupedDataKeys: {},
      headerRows: {},
      dataRows: {},
      processedCsv: false
    }
  },
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getMatrixOvers',
      'getAdditionalDevices'
    ]),
    deviceId () {
      return this.$route.params.deviceId
    }
  },
  mounted () {
    const input = this.getMatrixInputs.filter(el => el.id === this.deviceId)
    if (input.length === 1) {
      this.device = input[0]
      this.parseCsv()
      return
    }
    const over = this.getMatrixOvers.filter(el => el.id === this.deviceId)
    if (over.length === 1) {
      this.device = over[0]
      this.parseCsv()
    }
    const additional = this.getAdditionalDevices.filter(el => el.id === this.deviceId)
    if (additional.length === 1) {
      this.device = additional[0]
      this.parseCsv()
    }
  },
  methods: {
    parseCsv () {
      const that = this
      const parseConfig = {
        download: true,
        delimiter: ',',
        complete: function (results) {
          that.postProcessCsv(results)
        }
      }
      Papa.parse(
        this.device.cccsv,
        parseConfig
      )
    },
    postProcessCsv (csvData) {
      for (const entry of csvData.data) {
        if (entry[0] === 'manufacturer') {
          continue
        }
        const groupName = entry[2]
        if (!this.groups.includes(groupName)) {
          this.groups.push(groupName)
        }
        if (typeof this.groupedData[groupName] === 'undefined') {
          this.groupedData[groupName] = []
          this.goupedDataKeys[groupName] = { 14: true } // always add last column "notes"
          this.headerRows[groupName] = []
          this.dataRows[groupName] = []
        }
        for (let i = 3; i < entry.length; i++) {
          if (entry[i] !== '') {
            this.goupedDataKeys[groupName][i] = true
          }
        }
        this.groupedData[groupName].push(entry)
        // console.log('csv post process', entry, grouped)
      }
      for (const groupName of this.groups) {
        // reduce headerRow to entries with values
        const headerRow = []
        const neededIndices = Object.keys(this.goupedDataKeys[groupName])
        for (const neededIndex of neededIndices) {
          headerRow.push(
            this.getHeaderStringForIndex(csvData.data[0][neededIndex])
          )
        }
        this.headerRows[groupName] = headerRow

        // reduce dataRow to entries with values
        for (const dataRowFull of this.groupedData[groupName]) {
          const dataRow = []
          for (const neededIndex of neededIndices) {
            dataRow.push(dataRowFull[neededIndex])
          }
          this.dataRows[groupName].push(dataRow)
        }
      }
      this.csvData = csvData
      this.processedCsv = true
    },
    getHeaderStringForIndex (index) {
      const headers = {
        manufacturer: 'Manufacturer',
        device: 'Device',
        section: 'Section',
        parameter_name: 'Parameter name',
        parameter_description: 'Description',
        cc_msb: 'CC MSB',
        cc_lsb: 'CC LSB',
        cc_min_value: 'CC min',
        cc_max_value: 'CC max',
        nrpn_msb: 'NRPN MSB',
        nrpn_lsb: 'NRPN LSB',
        nrpn_min_value: 'NRPN min',
        nrpn_max_value: 'NRPN max',
        orientation: 'Orientation',
        notes: 'Notes'
      }
      if (typeof headers[index] !== 'undefined') {
        return headers[index]
      }
      return index
    },
    scrollToSection (event) {
      this.$scrollTo(event.currentTarget.dataset.section)
    }
  },
  created () {
    // console.log(this.$papa)
  }
}

</script>
