<template>
    <v-form ref="form">
        <v-select
            @change="fillVersionName"
            v-model="formData.version"
            :label="$t('Versions')"
            :items="versions"
            :disabled="!canEditVersion"
        >
            <template v-slot:prepend-item>
                <v-list-item>
                    <v-checkbox
                        v-model="showRelease"
                        class="mr-3"
                        :label="$t('Release')"
                    />
                    <v-checkbox
                        v-model="showSnapShot"
                        class="mr-3"
                        :label="$t('Snapshot')"
                    />
                    <v-text-field
                        v-model="search"
                        :placeholder="$t('Search')"
                    />
                </v-list-item>
            </template>
            <template v-slot:no-data>
                <v-list-item>{{ $t("NoData") }}</v-list-item>
            </template>
        </v-select>
        <v-text-field
            v-model="formData.name"
            :rules="versionNameRule()"
            :label="$t('VersionName')"
            :disabled="!canEditName"
        />
        <div v-if="showDownload" style="display: flex">
            <v-checkbox
                v-model="formData.downloadImmediately"
                class="mr-3"
                :ripple="false"
                :label="$t('DownloadContentImmediately')"
            />
            <v-checkbox
                v-model="formData.startGame"
                v-if="formData.downloadImmediately"
                :label="$t('StartGameWhenDownloadFinish')"
            />
        </div>
        <v-btn class="mt-5" color="green" :loading="loading" @click="handleSave">{{
            $t("Save")
        }}</v-btn>
    </v-form>
</template>

<script>
import {
    fetchVersionManifest,
    fetchVersionDetail,
    writeVersionDetail
} from "../scripts/downloader/version";
import { scheduleDownloadTasks } from "../scripts/common";
import { validateResources, launch } from "../scripts/launcher";
import { renameVersion } from '../scripts/versions';

export default {
    props: {
        formData: {
            type: Object,
            default: () => ({
                version: undefined,
                name: undefined,
                downloadImmediately: true,
                startGame: false
            })
        },
        showDownload: {
            type: Boolean,
            default: true
        },
        canEditName: {
            type: Boolean,
            default: true,
        },
        canEditVersion: {
            type: Boolean,
            default: true
        }
    },
    async mounted() {
        this.manifest = await fetchVersionManifest();
        this.fetchVersions();
    },
    watch: {
        showRelease: function() {
            this.fetchVersions();
        },
        showSnapShot: function() {
            this.fetchVersions();
        },
        search: function() {
            this.fetchVersions();
        },
        formData: function() {
            console.log('change')
            this.originalFormData = {...this.formData}
        }
    },
    data: () => ({
        versions: [],
        manifest: {},
        showRelease: true,
        showSnapShot: false,
        search: "",
        loading: false,
        originalFormData: {}
    }),
    methods: {
        async fetchVersions() {
            try {
                const results = [];
                this.manifest.versions.forEach(version => {
                    const { type, id } = version;
                    if (
                        (type === "snapshot" && this.showSnapShot) ||
                        (type === "release" && this.showRelease)
                    ) {
                        results.push({
                            text: `${type} ${id}`,
                            value: id
                        });
                    }
                });
                this.versions = results.filter(data =>
                    data.text.includes(this.search)
                );
            } catch (e) {
                this.$emit("error", e);
            }
        },
        versionNameRule() {
            return [
                value => {
                    if (!value) return this.$t("CanNotBeEmpty");
                    return true;
                },
                value => {
                    if (
                        this.$store.state.versions.find(
                            version => version.name === value
                        ) && this.canEditName
                    )
                        return this.$t("NameExisted");
                    return true;
                }
            ];
        },
        fillVersionName() {
            this.formData.name = this.formData.version;
        },
        async handleSave() {
            if (this.originalFormData.name) {
                renameVersion(this.originalFormData.name, this.formData.name)
                this.$router.push('/versions')
                return
            }
            const versionMeta = this.manifest.versions.find(
                version => version.id === this.formData.version
            );
            const versionDetail = await fetchVersionDetail(versionMeta.url);
            await writeVersionDetail(versionDetail);
            if (this.formData.downloadImmediately) {
                this.loading = true;

                const tasks = await validateResources(
                    versionDetail,
                    this.formData.name
                );

                await scheduleDownloadTasks({
                    store: this.$store,
                    name: this.formData.name,
                    tasks,
                    callback: async () => {
                        if (this.formData.startGame) {
                            try {
                                await launch(versionDetail);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }
                });
                this.loading = false;
            }
            this.$router.push('/versions')
        }
    }
};
</script>

<style scoped></style>
