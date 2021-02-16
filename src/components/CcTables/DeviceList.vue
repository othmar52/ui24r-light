<template>
  <div>
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'MatrixMixerShow' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        All CC TABLES
      </h2>
      <nav class="nav nav--subnav">
      </nav>
    </header>
    <div>
      <div v-for="(item, index2) in itemsWithCC" v-bind:key="index2+333" class="">
        <br>
        <router-link :to="{ name: 'CcTablesShow', params: { deviceId: item.id } }" :class="`btn color-${item.color}`">
          {{item.name}}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'DeviceList',
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getMatrixOvers',
      'getAdditionalDevices'
    ]),
    itemsWithCC () {
      const items = this.getMatrixInputs.filter(
        el => typeof el.cccsv !== 'undefined'
      ).concat(
        this.getMatrixOvers.filter(
          el => typeof el.cccsv !== 'undefined'
        )
      ).concat(
        this.getAdditionalDevices.filter(
          el => typeof el.cccsv !== 'undefined'
        )
      )
      // console.log('items', items)
      return items
    }
  }
}

</script>
