<template>
  <div class="newroute__wizard">
    <h3>toller router wizard</h3>
    <div v-if="!newRoute.from.input">
      <h3>choose source</h3>
      <div class="matrixconf__inputs">
        <div v-for="(item, index) in getUnroutedMatrixInputs" v-bind:key="index+100">
        <button
            :class="`btn btn-active color-${item.color}`"
            @click="selectRouteFrom"
            :data-channels="item.channels">
            {{ item.name }}
        </button>
        <VuMeter
            v-if="item.channels.length === 1"
            :keyVu="`vu.i.${item.channels[0]}.mix`"
            socketId="mixer1"
        />
        <VuMeterStereo
            v-else
            :keyVuLeft="`i.${item.channels[0]}.mix`"
            :keyVuRight="`i.${item.channels[1]}.mix`"
            socketId="mixer1"
        />
        </div>
      </div>
      </div>
      <div v-else>
        <div class="matrixconf__inputs">
        <div>
        <button
            :class="`btn btn-active color-${newRoute.from.input.color}`">
            {{ newRoute.from.input.name }}
        </button>
        <VuMeter
            v-if="newRoute.from.input.channels.length === 1"
            :keyVu="`vu.i.${newRoute.from.input.channels[0]}.mix`"
            socketId="mixer1"
        />
        <VuMeterStereo
            v-else
            :keyVuLeft="`i.${newRoute.from.input.channels[0]}.mix`"
            :keyVuRight="`i.${newRoute.from.input.channels[1]}.mix`"
            socketId="mixer1"
        />
        </div>
        <br>
        <button class="btn" @click="resetInput">change</button>
        <div v-for="(item, index) in newRoute.over" v-bind:key="index+700">
            <span
              class="arrow"
              @click="moveOverToLeft"
              :data-channels="item.output.channels">
              &#10145;</span>
            over: {{ item.input.name }}<br>
            <button
              @click="removeRouteOver"
              :data-channels="item.output.channels">
              remove
            </button>
        </div>
        <div v-if="getAvailableOvers.length">
          <span class="arrow">&#10145;</span>
          <div>
             over
            <div v-for="(item, index) in getAvailableOvers" v-bind:key="index+200">
              <button
                  :class="`btn btn-active color-${item.color}`"
                  @click="addRouteOver"
                  :data-channels="item.channels">
                  {{ item.name }}
              </button>
            </div>
          </div>
        </div>
        <span class="arrow">&#10145;</span>
        <div>
          to output
          <div v-for="(item, index) in getEnabledMatrixOutputsUnique" v-bind:key="index+200">
            <button
                :class="`btn btn-active color-${item.color}`"
                @click="selectRouteTarget"
                :data-channels="item.channels">
                {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button @click="cancelWizard">
      cancel
    </button>
    <button @click="saveRoute" v-if="newRoute.from.input">
      save route
    </button>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import VuMeter from '@/components/VuMeter.vue'
import VuMeterStereo from '@/components/VuMeterStereo.vue'
export default {
  name: 'NewRouteWizard',
  data () {
    return {
      matrixInputs: this.$store.state.matrixInputs,
      matrixOutputs: this.$store.state.matrixOutputs,
      selectedInput: undefined,
      selectedOutput: {},
      newRoute: {
        from: {
          input: undefined,
          muted: false,
          toHeadphones: false
        },
        over: [],
        to: {
          output: undefined,
          level: 0.5,
          fx1: false,
          fx2: false,
          fx3: false,
          fx4: false
        }
      }
    }
  },
  components: {
    VuMeter,
    VuMeterStereo
  },
  computed: {
    ...mapGetters([
      // 'getMatrixInputs',
      // 'getMatrixOutputs',
      // 'getCurSetup'
      'getEnabledMatrixOutputsUnique',
      'getEnabledMatrixOutputsMulti',
      'getUnroutedMatrixInputs'
    ]),
    getAvailableOvers () {
      const items = []
      let skipItem
      for (const item of this.getEnabledMatrixOutputsMulti) {
        skipItem = false
        // avoid audio loop by routing from out to in of the same device
        if (item.inputChannels.join(',') === this.newRoute.from.input.channels.join(',')) {
          continue
        }
        // skip items that are already within our signal chain
        for (const over of this.newRoute.over) {
          if (over.output.channels.join(',') === item.channels.join(',')) {
            skipItem = true
            break
          }
        }
        if (skipItem === false) {
          items.push(item)
        }
      }
      // return []
      return items
    }
  },
  methods: {
    cancelWizard () {
      this.$emit('cancelWizard')
    },
    resetInput () {
      this.newRoute.from.input = undefined
    },
    selectRouteFrom (event) {
      for (const item of this.matrixInputs) {
        if (event.target.dataset.channels !== item.channels.join(',')) {
          continue
        }
        this.newRoute.from.input = item
        break
      }
      // console.log('selected input', this.newRoute.from.input)
      // if (this.getEnabledMatrixOutputsUnique.length === 1) {
      //  this.selectedOutput = this.getEnabledMatrixOutputsUnique[0]
      //  console.log('selected output', this.selectedOutput)
      // }
      // this.$emit('cancelWizard')
    },
    addRouteOver (event) {
      for (const outputItem of this.matrixOutputs) {
        if (event.target.dataset.channels !== outputItem.channels.join(',')) {
          continue
        }
        for (const inputItem of this.matrixInputs) {
          // console.log('compare', outputItem.inputChannels.join(','), inputItem.channels.join(','))
          if (outputItem.inputChannels.join(',') !== inputItem.channels.join(',')) {
            continue
          }
          // console.log('found item ------------------------------')
          this.newRoute.over.push({
            input: inputItem,
            output: outputItem,
            bypass: false
          })
          break
        }
        break
      }
      // console.log('selected over', this.newRoute.over)
    },
    removeRouteOver (event) {
      const newOver = []
      for (const over of this.newRoute.over) {
        if (event.target.dataset.channels === over.output.channels.join(',')) {
          continue
        }
        newOver.push(over)
      }
      this.newRoute.over = newOver
    },
    moveOverToLeft (event) {
      if (this.newRoute.over.length < 2) {
        // console.log('nothing to move left...')
        return
      }
      let itemPosition
      this.newRoute.over.forEach(function (over, idx) {
        if (event.target.dataset.channels === over.output.channels.join(',')) {
          itemPosition = idx
        }
      })
      if (itemPosition === 0) {
        // item is already very left
        return
      }
      // console.log('move over from index', itemPosition, 'to', itemPosition - 1)
      this.newRoute.over.splice(itemPosition - 1, 0, this.newRoute.over.splice(itemPosition, 1)[0])
    },
    selectRouteTarget (event) {
      for (const item of this.matrixOutputs) {
        if (event.target.dataset.channels !== item.channels.join(',')) {
          continue
        }
        this.newRoute.to.output = item
        break
      }
      // console.log('selected input', this.newRoute.to.output)
      // if (this.getEnabledMatrixOutputsUnique.length === 1) {
      //  this.selectedOutput = this.getEnabledMatrixOutputsUnique[0]
      //  console.log('selected output', this.selectedOutput)
      // }
      // this.$emit('cancelWizard')
    },
    saveRoute () {
      this.$store.commit('saveMatrixRoute', this.newRoute)
      this.$emit('cancelWizard')
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.arrow {
  font-size: 50px;
  padding: 0 20px;
}
</style>
