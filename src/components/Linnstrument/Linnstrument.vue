<template>
  <div class="linnstrument">
    <div v-for="(currentRow, index) in row1" v-bind:key="index+5883" class="tr">
        <LinnstrumentRow :cellString="currentRow" />
    </div>
  </div>
</template>

<script>

import LinnstrumentRow from '@/components/Linnstrument/Row.vue'
export default {
  name: 'Linnstrument',
  components: {
    LinnstrumentRow
  },
  data () {
    return {
      row1: []
    }
  },
  props: {
    matrix: Array
  },
  mounted () {
    this.row1 = this.matrix
    for (var i = 0; i < 8; i++) {
      if (typeof this.row1[i] === 'undefined') {
        this.row1.push(' ')
      }
    }
  }
}

</script>

<style lang="scss">

.linnstrument {
    background: black;
    padding: 20px;
    display: inline-block;
}

.linnstrument-row {
  display: flex;
  &>div {
      background: #c8c2b3;
      border: 2px solid #b7afa0;
      width: 25px;
      height: 25px;
  }
}

.linnstrument-cell {
  background-color: green;
  position: relative;
  &:after {
      content: "●";
      position: absolute;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3), 0 0 5px rgba(0,0,0,0.3);
      left: 22%;
  }
  &.linnstrument-cell-g {
      color: #4cffb6;
  }
  &.linnstrument-cell-y {
      color: #fffeab;
  }
  &.linnstrument-cell-b {
      color: #97aeff;
  }
  &.linnstrument-cell-t {
      color: #50fefe;
  }
  &.linnstrument-cell-r {
      color: #feadb4;
  }
  &.linnstrument-cell-p {
      color: #f0c4fe;
  }
  &.linnstrument-cell-:after {
      content: "";
  }
}
</style>
