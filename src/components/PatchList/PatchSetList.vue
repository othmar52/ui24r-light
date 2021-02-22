<template>
  <div>
    <header>
      <nav class="nav nav--subnav">
        <router-link :to="{ name: 'MatrixMixerShow' }">
          <span class="arrow flipped__text">&#x27A1;</span>
        </router-link>
      </nav>
      <h2>
        All Patchsets
      </h2>
      <nav class="nav nav--subnav">
      </nav>
    </header>
    <div>
      <div v-for="(item, index2) in itemsWithCC" v-bind:key="index2+333" class="">
        <br>
        <router-link :to="{ name: 'PatchListShow', params: { deviceId: item.id } }" :class="`btn color-${item.color}`">
          {{item.name}}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'PatchSetList',
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getMatrixOvers',
      'getAdditionalDevices'
    ]),
    itemsWithCC () {
      const items = this.getMatrixInputs.filter(
        el => el.patchcsv.length > 0
      ).concat(
        this.getMatrixOvers.filter(
          el => el.patchcsv.length > 0
        )
      ).concat(
        this.getAdditionalDevices.filter(
          el => el.patchcsv.length > 0
        )
      )
      // console.log('items', items)
      return items
    }
  }
}

</script>
