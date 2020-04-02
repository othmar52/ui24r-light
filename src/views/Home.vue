<template>
  <div class="home">
    <CreateConfig v-if="!haveValidConfig" />
    <MainMenu v-if="haveValidConfig" />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateConfig from '@/components/config/CreateConfig.vue'
import MainMenu from '@/components/MainMenu.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {
    CreateConfig,
    MainMenu
  },
  computed: {
    ...mapGetters({
      haveValidConfig: 'haveValidConfig'
    })
  }
}
</script>
