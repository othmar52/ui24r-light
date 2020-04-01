<template>
  <div v-if="!socketConnected" class="overlay">{{ text }}</div>
</template>

<script>
import  { mapGetters } from 'vuex'
export default {
  name: 'Overlay',
  props: {
    text: String
  },
  computed: {
    ...mapGetters({
      socketConnected: 'isSocketConnected'
    })
  }
}

</script>

<style>

.overlay {
    /* some styles to position the modal at the center of the page */
    position: absolute;
    font-size: 2em;
    font-weight: bold;
    top: 50%;
    left: 50%;
    width: 300px;
    line-height: 80px;
    height: 80px;
    margin-left: -150px;
    margin-top: -100px;
    color: white;
    background-color: rgba(0,0,0,0.8);
    text-align: center;
    border-radius: 5px;
  
    /* needed styles for the overlay */
    z-index: 10; /* keep on top of other elements on the page */
    box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);
}

</style>
