<template>
  <v-app>
    <Drawer />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from '@/components/Drawer.vue'

export default {
  name: 'Home',
  components: {
    Drawer
  }
}
</script>

<style>
@import 'global.css';

#content {
  height: 100vh;
}

</style>
