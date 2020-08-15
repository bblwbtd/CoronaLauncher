<template>
    <v-container fluid class="fill-height align-content-start">
        <v-app-bar flat app>
            <v-toolbar-title>{{$t('Config')}}</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs v-model="tab" hide-slider>
                    <v-tab>{{$t('BasicConfig')}}</v-tab>
                    <v-tab>{{$t('Accounts')}}</v-tab>
                    <v-tab>{{$t('About')}}</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <BasicConfigForm v-if="tab === 0" />
        <AccountConfig v-if="tab === 1" />
    </v-container>
</template>

<script>
import AccountConfig from '../components/AccountConfig.vue'
import BasicConfigForm from "../components/BasicConfigForm.vue"

export default {
    name: "config",
    components: {
        BasicConfigForm, 
        AccountConfig
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