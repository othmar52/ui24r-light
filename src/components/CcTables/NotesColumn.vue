<template>
  <div>
    <span v-if="keyValuePairs.length === 0">{{fieldData}}</span>
    <span v-else v-for="(keyValuePair, index) in keyValuePairs" v-bind:key="index+88" class="">
      <span v-if="keyValuePairs.value !== ''" class="outlined">
        <span class="color--spot">{{keyValuePair.key}}</span> {{keyValuePair.value}}
      </span>
      <span v-else>{{keyValuePair.key}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'NotesColumn',
  data () {
    return {
      keyValuePairs: []
    }
  },
  props: {
    fieldData: String
  },
  computed: {
    getAvailableMatrixInputs () {
      return (this.getMatrixHelperEnabled === true)
        ? this.getUnroutedMatrixInputs
        : this.getEnabledMatrixInputs
    }
  },
  mounted () {
    if (this.fieldData === '') {
      return
    }
    const delimiter1 = ';'
    const delimiter2 = ':'
    const keyValuePairs = this.fieldData.split(delimiter1)
    if (keyValuePairs.length === 1) {
      return
    }
    for (let pair of keyValuePairs) {
      pair = pair.replace('=', delimiter2)
      const xxx = pair.split(delimiter2)
      if (xxx.length === 2) {
        this.keyValuePairs.push({
          key: xxx[0].trim(),
          value: xxx[1].trim()
        })
        continue
      }
      this.keyValuePairs.push({
        key: pair.trim(),
        value: ''
      })
    }
  },
  methods: {
    parseCsv () {

    }
  }
}

</script>
