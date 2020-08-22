<template>
    <v-container class="fill-height" fluid>
        <v-app-bar app>
                <BackButton />
            <v-toolbar-title>{{$t('VersionConfig')}}</v-toolbar-title>
            <v-spacer />
            <DownloadButton />
            <template v-slot:extension>
              <v-tabs v-model="tab" hide-slider >
                <v-tab>
                  {{$t('BasicConfig')}}
                </v-tab>
              </v-tabs>
            </template>
        </v-app-bar>
        <v-row no-gutters align="start" justify="center">
            <v-col cols="8" md="6" lg="4">
                <VersionConfigForm />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import DownloadButton from "../components/DownloadButton"
import VersionConfigForm from "../components/VersionConfigForm"
import BackButton from "../components/BackButton"

export default {
  components: {
    DownloadButton,
    VersionConfigForm,
    BackButton
  },
  data: () => ({
    tab: 0
  })
}
</script>

<style>
</style>