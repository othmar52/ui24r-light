<template>
  <div class="hello">
    <h1>ui24r light</h1>
    <p>a custom lightweight web interface for <a href="https://www.soundcraft.com/en/products/ui24r" target="_blank">Soundcraft ui24r mixing console</a>.<br>
    This is no (and is not going to be a) replacement for the powerful native web-GUI!</p>
    <ul class="nav">
      <li>
        <router-link :to="{ name: 'MyAuxMixConfigurator' }" class="btn">
          My AUX mix
          <p>improved version of ui24r's native <i>"more-me"</i> functionality</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'RecmonitorSelector' }" class="btn">
          Rec-monitor
          <p>non-interactive view to keep track of recording status</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'MyAuxMixConfigurator' }" class="btn">
          Custom Faders
          <p>limit your GUI to the faders you need</p>
        </router-link>
      </li>
    </ul>
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

<style lang="scss">
.hello {
  p {
    a {
      text-decoration: underline;
    }
  }
}
</style>
