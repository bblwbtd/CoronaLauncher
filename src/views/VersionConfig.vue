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
                    <v-tab>
                        {{ $t("AdvancedConfig") }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-row no-gutters align="start" justify="center">
            <v-col cols="8" md="6" lg="4">
                <div v-show="currentTab === 0">
                    <VersionConfigForm
                        ref="basicConfig"
                        :versions="manifest.versions"
                        :canEditVersion="canEditVersion"
                        :canEditName="canEditName"
                        :showDownload="!version"
                        :formData="originalFormData"
                    />
                </div>

                <div v-show="currentTab === 1">
                    <AdvancedConfigForm
                        ref="advancedConfig"
                        :formData="originalAdvanceConfig"
                    />
                </div>
            </v-col>
        </v-row>
        <v-btn
            :loading="loading"
            @click="handleSave"
            :ripple="false"
            large
            icon
            class="float-btn green"
            color="white"
        >
            <v-icon>mdi-content-save</v-icon>
        </v-btn>
    </v-container>
</template>

<script>
import DownloadButton from "../components/DownloadButton";
import VersionConfigForm from "../components/VersionConfigForm";
import BackButton from "../components/BackButton";
import AdvancedConfigForm from "../components/AdvancedConfigForm";
import {
    fetchVersionDetail,
    writeVersionDetail,
    fetchVersionManifest
} from "../scripts/downloader/version";
import { scheduleDownloadTasks } from "../scripts/common";
import { validateResources, launch } from "../scripts/launcher";
import { renameVersion } from "../scripts/versions";

export default {
    components: {
        DownloadButton,
        VersionConfigForm,
        BackButton,
        AdvancedConfigForm
    },
    props: {
        version: {
            type: String
        },
        tab: {
            type: Number
        }
    },
    async mounted() {
        this.manifest = await fetchVersionManifest();
        console.log(this.version);
        const targetVersion = this.$store.state.versions.find(
            v => v.name === this.version
        );
        if (targetVersion) {
            this.originalFormData = {
                version: targetVersion.baseVersion.id,
                name: targetVersion.name
            };
            this.originalAdvanceConfig = this.$store.state.config.versionConfig[
                this.version
            ];
            this.canEditName =
                targetVersion.name !== targetVersion.baseVersion.id;
            this.canEditVersion = false;
        }
        this.currentTab = this.tab;
    },
    data: () => ({
        currentTab: 0,
        manifest: {},
        originalFormData: undefined,
        originalAdvanceConfig: undefined,
        canEditName: true,
        canEditVersion: true,
        loading: false
    }),
    methods: {
        async handleSave() {
            this.loading = true;
            await this.saveBasicConfig();
            await this.saveAdvanceConfig();
            this.loading = false;
            this.$router.push("/versions");
        },
        async saveBasicConfig() {
            const formData = this.$refs.basicConfig.formData;

            if (this.originalFormData && this.originalFormData.name) {
                renameVersion(this.originalFormData.name, formData.name);
                return;
            }
            const versionMeta = this.manifest.versions.find(
                version => version.id === formData.version
            );
            const versionDetail = await fetchVersionDetail(versionMeta.url);
            await writeVersionDetail(versionDetail);

            if (formData.downloadImmediately) {
                const tasks = await validateResources(
                    versionDetail,
                    formData.name
                );

                await scheduleDownloadTasks({
                    store: this.$store,
                    name: formData.name,
                    tasks,
                    callback: async () => {
                        if (formData.startGame) {
                            try {
                                await launch(versionDetail);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }
                });
            }
        },
        async saveAdvanceConfig() {
            const versionName = this.$refs.basicConfig.formData.name;
            const formData = this.$refs.advancedConfig.formData;
            const config = this.$store.state.config;
            config.versionConfig[versionName] = formData;
            this.$store.commit("setConfig", config);
        }
    }
};
</script>

<style></style>
