<template>
  <div class="hello">
    <header>
      <span></span>
      <h2>spaceship control</h2>
      <span></span>
    </header>
    <p>a custom lightweight web interface for <a href="https://www.soundcraft.com/en/products/ui24r" target="_blank">Soundcraft ui24r mixing console</a>.<br>
    This is no (and is not going to be a) replacement for the powerful native web-GUI!</p>
    <nav class="nav nav__main">
      <router-link :to="{ name: 'MatrixMixerShow' }" class="btn">
        Matrix audio router
      </router-link>
      <router-link :to="{ name: 'MatrixMixerConfigurator' }" class="btn">
        Matrix mixer config
      </router-link>
      <router-link :to="{ name: 'DeviceList' }" class="btn">
        CC Tables
      </router-link>
      <router-link :to="{ name: 'User1Show' }" class="btn">
        Documentation
      </router-link>
      <router-link :to="{ name: 'PatchSetList' }" class="btn">
        PatchList
      </router-link>
      <!--
      <router-link :to="{ name: 'RecmonitorSelector' }" class="btn">
        Rec-monitor
        <p>non-interactive view to keep track of recording status</p>
      </router-link>
      -->
    </nav>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    msg: String
  }
}
</script>
