<template>
  <v-container fluid class=" fill-height align-stretch" >
      <v-app-bar flat app>
            <BackButton />
          <v-toolbar-title>
              {{$t('Download')}}
          </v-toolbar-title>
      </v-app-bar>
      <v-row justify="center">
          <v-col cols="10" md="8" lg="6">
              <DownloadList />
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import DownloadList from '../components/DownloadList'
import BackButton from '../components/BackButton'

export default {
    components: {
        DownloadList,
        BackButton
    }
}
</script>

<style>

</style>