<template>
  <div class="linnstrument-row">
    <div v-for="(cellChar, index) in cells" v-bind:key="index+5883" class="tr">
        <div :class="`linnstrument-cell linnstrument-cell-${cellChar}`"> </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinnstrumentRow',
  data () {
    return {
      cells: []
    }
  },
  props: {
    cellString: Array
  },
  mounted () {
    this.cells = Array.from(this.cellString.padEnd(25))
  }
}

</script>
