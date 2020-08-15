<template>
    <v-row justify="center" align="start">
        <v-col cols="12" md="8" lg="6">
            <v-form ref="form">
                <v-select v-model="config.language" :label="$t('Language')" :items="languages" />
                <v-select
                    v-model="config.currentMirror"
                    :label="$t('Mirror')"
                    :items="Object.keys(config.mirrors)"
                />
                <v-text-field
                    :rules="[(value) => value ? true : $t('CanNotBeEmpty')]"
                    v-model="config.gameRoot"
                    :label="$t('GameRoot')"
                />
                <v-checkbox
                    v-model="config.closeLauncherOnStart"
                    :label="$t('CloseLauncherOnStart')"
                />
                <v-btn @click="resetForm" color="orange" class="mr-3">{{$t('Reset')}}</v-btn>
                <v-btn @click="saveConfig" color="green">{{$t('Save')}}</v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { getConfig } from '../scripts/config'

export default {
    name: 'BasicConfigForm',
    data: () => ({
            config: getConfig(),
            languages: [
                {
                    text: "🇨🇳简体中文",
                    value: "cn",
                },
                {
                    text: "🇺🇸English",
                    value: "en",
                },
            ],
        }),
    methods: {
        resetForm() {
            this.config = getConfig()
        },
        saveConfig() {
            this.$i18n.locale = this.config.language
            this.$store.commit('setConfig', this.config)
        }
    }
}
</script>

<style scoped>
</style>