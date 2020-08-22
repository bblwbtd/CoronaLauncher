<template>
    <v-container style="padding: 0" fluid class="fill-height align-content-start justify-start">
        <v-app-bar flat app>
            <v-toolbar-title>{{$t('Home')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <DownloadButton />
        </v-app-bar>
        <v-img height="100%" src="../assets/minecraft.jpeg">
            <div id="content">
                <v-menu max-height="40vh" open-on-hover top offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :ripple="false" large id="op" v-on="on" v-bind="attrs">
                            <div id="op_content">
                                <div>{{$t('Play')}}</div>
                                <div style="font-size: 0.8rem"></div>
                            </div>
                        </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item>
                        {{$t('Latest')}}
                      </v-list-item>
                      <v-list-item @click="() => {}" :key="version.name" v-for="version in $store.state.versions">
                        <v-list-item-content>
                          {{version.name}}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-img>
    </v-container>
</template>

<script>
import DownloadButton from '../components/DownloadButton'

export default {
  name: 'Home',
  components: {
    DownloadButton
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
    background-image: url("../assets/button.png");
    background-position: center;
    background-size: contain;
    font-size: 1rem;
}
#op_content {
    display: flex;
    flex-direction: column;
}
#content {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
