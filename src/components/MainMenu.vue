<template>
  <div class="hello">
    <h1>ui24r matrix mixer</h1>
    <p>a custom lightweight web interface for <a href="https://www.soundcraft.com/en/products/ui24r" target="_blank">Soundcraft ui24r mixing console</a>.<br>
    This is no (and is not going to be a) replacement for the powerful native web-GUI!</p>
    <nav class="nav nav__main">
      <div>
        <router-link :to="{ name: 'MatrixMixerShow' }" class="btn">
          Matrix mixer
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'MatrixMixerConfigurator' }" class="btn">
          Matrix mixer config
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'RecmonitorSelector' }" class="btn">
          Rec-monitor
          <p>non-interactive view to keep track of recording status</p>
        </router-link>
      </div>
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
