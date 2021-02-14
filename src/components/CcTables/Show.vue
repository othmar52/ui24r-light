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
      </nav>
    </header>
    <div v-if="processedCsv">
      <div v-for="(groupName, index) in groups" v-bind:key="index+88" class="xx">
        <h2>{{groupName}}</h2>
        <table class="table table--fullwidth">
          <tr class="tr">
            <th v-for="(header, index2) in headerRows[groupName]" v-bind:key="index2+444" class="th td">
              <div :class="index2 === 1 ? 'color--spot' : ''">{{header}}</div>
            </th>
          </tr>
          <tr v-for="(csvLine, index2) in dataRows[groupName]" v-bind:key="index2+333" class="tr">
            <td v-for="(csvField, index3) in csvLine" v-bind:key="index3+777" class="td">
              <div :class="index3 === 1 ? 'color--spot' : ''">{{csvField}}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!--
    <div v-if="csvData" class="table table--fullwidth">
      <div v-for="(csvLine, index) in csvData.data" v-bind:key="index+888" class="tr">
        <div v-for="(csvField, index2) in csvLine" v-bind:key="index2+8888" :class="index === 0 ? 'th' : 'td'">
          {{csvField}}
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'CcTablesShow',
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
  props: {
    // deviceId: String
  },
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getMatrixOvers'
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
      this.$papa.parse(
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
    }
  },
  created () {
    // console.log(this.$papa)
  }
}

</script>
