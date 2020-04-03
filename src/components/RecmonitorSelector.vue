<template>
  <div class="recmonitor__selector">
    select mixer instance<br>
    <router-link :to="{ name: 'RecmonitorShow', params: { socketId: 'mixer1' }}">mixer1</router-link><br>
    <router-link :to="{ name: 'RecmonitorShow', params: { socketId: 'mixer2' }}">mixer2</router-link><br>
    <router-link :to="{ name: 'Home' }">back to menu</router-link>
  </div>
</template>
