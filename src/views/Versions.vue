<template>
    <v-container class="align-content-start justify-center fill-height" fluid>
        <v-app-bar app>
            <v-toolbar-title>{{$t('Versions')}}</v-toolbar-title>
            <v-spacer />
            <DownloadButton />
        </v-app-bar>
        <v-row class="justify-center">
            <v-col cols="12" md="8" lg="6">
                {{$t('Installed')}}
                <VersionList class="mt-3" />
            </v-col>
        </v-row>
        <v-btn @click="$router.push('/versions/config')" :ripple="false" large icon class="float-btn green" color="white">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-container>
</template>

<script>
import VersionList from '../components/VersionList'
import DownloadButton from '../components/DownloadButton'

export default {
    name: 'Version',
    components: {
      VersionList,
      DownloadButton
    }
}
</script>

<style scoped>
</style>