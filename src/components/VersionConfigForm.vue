<template>
    <v-form ref="form">
        <v-select
            @change="fillVersionName"
            v-model="formData.version"
            :label="$t('Versions')"
            :items="versions"
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
        />
        <div style="display: flex">
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
        <v-btn color="green" :loading="loading" @click="handleSave">{{
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
import { validateResources } from "../scripts/launcher";

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
        }
    },
    data: () => ({
        versions: [],
        manifest: {},
        showRelease: true,
        showSnapShot: false,
        search: "",
        loading: false
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
                        )
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
            if (this.formData.downloadImmediately) {
                this.loading = true;
                const versionMeta = this.manifest.versions.find(
                    version => version.id === this.formData.version
                );
                const versionDetail = await fetchVersionDetail(versionMeta.url);
                await writeVersionDetail(JSON.stringify(versionDetail));
                const tasks = await validateResources(
                    versionDetail,
                    this.formData.name
                );

                await scheduleDownloadTasks({
                    store: this.$store,
                    name: this.formData.name,
                    tasks
                });
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped></style>
