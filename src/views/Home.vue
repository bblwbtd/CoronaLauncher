<template>
  <v-container style="padding: 0" fluid class="fill-height align-content-start justify-start">
    <v-app-bar flat app>
      <v-toolbar-title>
        {{$t('Home')}}
      </v-toolbar-title>
    </v-app-bar>
    <v-img height="100%" src="../assets/minecraft.jpeg"> 
      <div id="content">
        <v-btn large id="op">{{$t('Play')}}</v-btn>
      </div>
    </v-img>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {
    
  },
  mounted() {
    
  },
  data(){
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
#op {
  position: absolute;
  bottom: 60px;
  width: 200px;
  height: 64px;
  background-image: url('../assets/button.png');
  background-position: center;
  background-size: contain;
  font-size: 1rem;
}
#content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
