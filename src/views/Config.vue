<template>
    <v-container fluid class="fill-height align-stretch">
        <v-app-bar flat app>
            <v-toolbar-title>{{$t('Config')}}</v-toolbar-title>
            <v-spacer />
            <DownloadButton />
            <template v-slot:extension>
                <v-tabs v-model="tab" hide-slider>
                    <v-tab>{{$t('BasicConfig')}}</v-tab>
                    <v-tab>{{$t('Accounts')}}</v-tab>
                    <v-tab>{{$t('About')}}</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-row no-gutters align="center" justify="center" v-if="tab === 0">
            <v-col cols="10" md="8" lg="6" >
                <BasicConfigForm />
            </v-col>
        </v-row>
        <v-row no-gutters class="align-start align-content-start" justify="center" v-if="tab === 1">
            <v-col align-self="start" cols="12" md="8" lg="6">
                <AccountConfig />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AccountConfig from '../components/AccountConfig.vue'
import BasicConfigForm from "../components/BasicConfigForm.vue"
import DownloadButton from "../components/DownloadButton"

export default {
    name: "config",
    components: {
        BasicConfigForm, 
        AccountConfig,
        DownloadButton,
    },
    mounted() {
        this.tab = this.$store.state.tab
    },
    watch: {
        tab: function(tab) {
            this.$store.commit('setTab', tab)
        }
    },
    data: () => ({
        tab: 0
    })
};
</script>

<style>
.v-tab {
    text-transform: none !important ;
}
</style>