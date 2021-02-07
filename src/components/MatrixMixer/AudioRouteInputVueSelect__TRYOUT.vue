<template>
  <div class="audioroute__input">
  <VueSelect
    :options="getAvailableMatrixInputs"
    v-on:option:selecting="chooseInput"
    v-on:option:deselecting="chooseInput"
    append-to-body
    :calculate-position="withPopper">
    <template #option="foo">
      <InputWithVu :item="foo" v-if="foo.id"/>
      <div v-else>No INPUT</div>
    </template>
    <template #selected-option="foo">
      <InputWithVu :item="foo" />
    </template>
    <template #no-options="foo">
      <InputWithVu :item="foo" />
    </template>
  </VueSelect>
   </div>
</template>

<script>
// npm --save i @popperjs/core
// npm install --save vue-select

import { mapGetters } from 'vuex'
import InputWithVu from '@/components/MatrixMixer/InputWithVu.vue'
import { VueSelect } from 'vue-select'
import { createPopper } from '@popperjs/core'
export default {
  name: 'AudioRouteInputVueSelect',
  components: {
    InputWithVu,
    VueSelect
  },
  props: {
    routeInput: {
      type: Object,
      default: function () {
        return undefined
      }
    }
  },
  data () {
    return {
      // simple example of items
      items: ['Item 1', 'Item 2', 'Item 3'],
      // there will be a selected item
      selected: null,
      placement: 'bottom',
      bla: null
    }
  },
  computed: {
    ...mapGetters([
      'getMatrixInputs',
      'getEnabledMatrixInputs',
      'getUnroutedMatrixInputs',
      'getMatrixHelperEnabled'
    ]),
    getAvailableMatrixInputs () {
      const emptyOption = {
        id: undefined,
        label: 'NO INPUT'
      }
      return (this.getMatrixHelperEnabled === true)
        ? this.getUnroutedMatrixInputs.concat(emptyOption)
        : this.getEnabledMatrixInputs.concat(emptyOption)
    }
  },
  methods: {
    chooseInput (item) {
      // console.log('chooseInput', item)
      this.$emit('setRouteInput', (item.id) ? item : undefined)
    },
    withPopper (dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = '300px'

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            }
          }]
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    }
  }
}
</script>

<style lang="scss">
.matrixconf__wizard {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background: black;
  padding: 20px;
  z-index: 10000;
  .matrixconf__inputs {
    display: flex;
    flex-wrap: wrap;

  }
}

.IZ-select {
  max-width: 200px;
}
</style>
