<template>
  <div class="page page--midicc">
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'MatrixMixerShow' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        Patchlist for
        <span v-if="processedCsv">{{csvData.data[1][0]}} - {{csvData.data[1][1]}}</span>
      </h2>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'PatchSetList' }" class="color--spot">
          all patch lists
        </router-link>
      </nav>
    </header>
    <nav class="nav nav--scrollnav" v-if="device && device.patchcsv.length > 1">
      <div
        v-for="(pathListItem, index) in device.patchcsv"
        v-bind:key="index+1123"
        class="btn"
        @click="setCsvIndex"
        :data-csvindex="index"
      >
        {{pathListItem.displayName}}
      </div>
    </nav>
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
              <div :class="header === headerBank || header === headerSBank || header === headerProgramChange ? 'color--spot' : ''">{{header}}</div>
            </th>
          </tr>
          <tr v-for="(csvLine, index2) in dataRows[groupName]" v-bind:key="index2+333" class="tr">
            <td v-for="(csvField, index3) in csvLine" v-bind:key="index3+777" class="td">
              <div :class="headerRows[groupName][index3] === headerBank || headerRows[groupName][index3] === headerSBank || headerRows[groupName][index3] === headerProgramChange ? 'color--spot' : ''">
                {{csvField}}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <h3>All patch list data provided by TODO: add and link repository</h3>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-multi-spaces */
import * as Papa from 'papaparse'
import { mapGetters } from 'vuex'
export default {
  name: 'PatchListShow',
  components: {
    // NotesColumn
  },
  data () {
    return {
      device: null,
      csvData: null,
      groups: [],
      groupedData: {},
      groupedDataKeys: {},
      headerRows: {},
      dataRows: {},
      currentCsvIndex: 0,
      processedCsv: false,
      headerBank: 'Bank*',
      headerSBank: 'SBank*',
      headerProgramChange: 'PC*'
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
        this.device.patchcsv[this.currentCsvIndex].url,
        parseConfig
      )
    },
    postProcessCsv (csvData) {
      for (const entry of csvData.data) {
        if (entry[0] === 'manufacturer') {
          continue
        }
        const groupName = entry[10]
        if (!this.groups.includes(groupName)) {
          this.groups.push(groupName)
        }
        if (typeof this.groupedData[groupName] === 'undefined') {
          this.groupedData[groupName] = []
          this.groupedDataKeys[groupName] = {
            0: false,      // always skip manufacturer
            1: false,      // always skip device
            2: false,      // always skip patchset
            3: true,       // always add displayname
            4: true,       // always add patchname
            5: false,      // always skip msb
            6: false,      // always skip lsb
            7: false,      // always skip programchange
            8: undefined,  // add poly if we have any value
            9: undefined,  // add arp if we have any value
            10: undefined, // add categories if we have any value
            11: undefined, // add digitakt-bank if we have any value
            12: undefined, // add digitakt-sbnk if we have any value
            13: undefined, // add digitakt-programchange if we have any value
            14: false,     // always skip creator-short
            15: undefined, // add creator if we have any value
            16: false,     // always skip creator-proximity
            17: false,     // always skip original-patchname
            18: false,     // always skip yt-startsecond
            19: false,     // always skip yt-starttime
            20: false,     // always skip yt-endsecond
            21: undefined  // add yt-link if we have any value

          }
          this.headerRows[groupName] = []
          this.dataRows[groupName] = []
        }
        for (let i = 3; i < entry.length; i++) {
          if (entry[i] !== '') {
            if (this.groupedDataKeys[groupName][i] !== false) {
              this.groupedDataKeys[groupName][i] = true
            }
          }
        }
        this.groupedData[groupName].push(entry)
        // console.log('csv post process', entry, grouped)
      }
      for (const groupName of this.groups) {
        // reduce headerRow to entries with values
        const headerRow = []
        const neededIndices = Object.keys(this.groupedDataKeys[groupName])
        for (const neededIndex of neededIndices) {
          if (this.groupedDataKeys[groupName][neededIndex] === true) {
            headerRow.push(
              this.getHeaderStringForIndex(csvData.data[0][neededIndex])
            )
          }
        }
        this.headerRows[groupName] = headerRow

        // reduce dataRow to entries with values
        for (const dataRowFull of this.groupedData[groupName]) {
          const dataRow = []
          for (const neededIndex of neededIndices) {
            if (this.groupedDataKeys[groupName][neededIndex] === true) {
              dataRow.push(dataRowFull[neededIndex])
            }
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
        displayname: 'Display',
        patchname: 'Patchname',
        categories: 'Categories',
        'digitakt-bank': this.headerBank,
        'digitakt-sbnk': this.headerSBank,
        'digitakt-programchange': this.headerProgramChange,
        creator: 'Creator'
      }
      if (typeof headers[index] !== 'undefined') {
        return headers[index]
      }
      return index
    },
    scrollToSection (event) {
      this.$scrollTo(event.currentTarget.dataset.section)
    },
    setCsvIndex (event) {
      this.currentCsvIndex = event.currentTarget.dataset.csvindex
      // reset parsed data and load new csv
      this.csvData = null
      this.groups = []
      this.groupedData = {}
      this.groupedDataKeys = {}
      this.dataRows = {}
      this.processedCsv = false
      this.parseCsv()
    }
  },
  created () {
    // console.log(this.$papa)
  }
}

</script>
