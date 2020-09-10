<template>
    <v-container class="fill-height" fluid>
        <v-app-bar app>
            <BackButton />
            <v-toolbar-title>{{ $t("VersionConfig") }}</v-toolbar-title>
            <v-spacer />
            <DownloadButton />
            <template v-slot:extension>
                <v-tabs v-model="currentTab" hide-slider>
                    <v-tab>
                        {{ $t("BasicConfig") }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-row no-gutters align="start" justify="center">
            <v-col cols="8" md="6" lg="4">
                <VersionConfigForm
                    :canEditVersion="canEditVersion"
                    :canEditName="canEditName"
                    :showDownload="!version"
                    :formData="formData"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import DownloadButton from "../components/DownloadButton";
import VersionConfigForm from "../components/VersionConfigForm";
import BackButton from "../components/BackButton";

export default {
    components: {
        DownloadButton,
        VersionConfigForm,
        BackButton
    },
    props: {
        version: {
            type: String
        },
        tab: {
            type: Number
        }
    },
    mounted() {
        const targetVersion = this.$store.state.versions.find(
            v => v.name === this.version
        );
        if (targetVersion) {
            this.formData = {
                version: targetVersion.baseVersion.id,
                name: targetVersion.name
            };
            this.canEditName =
                targetVersion.name !== targetVersion.baseVersion.id;
            this.canEditVersion = false
        }
        this.currentTab = this.tab;
    },
    data: () => ({
        currentTab: 0,
        formData: undefined,
        canEditName: true,
        canEditVersion: true
    })
};
</script>

<style></style>
