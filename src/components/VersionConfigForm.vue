<template>
    <v-form ref="form">
        <v-select
            @change="fillVersionName"
            v-model="formData.version"
            :label="$t('Versions')"
            :items="finalVersions"
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
    </v-form>
</template>

<script>


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
        versions: {
            type: Array,
            default: () => []
        },
        showDownload: {
            type: Boolean,
            default: true
        },
        canEditName: {
            type: Boolean,
            default: true
        },
        canEditVersion: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        finalVersions: function() {
            return this.versions.filter(version => {

                if (!this.showRelease && version.type === 'release') return false

                if (!this.showSnapShot && version.type === 'snapshot') return false

                return version.id.includes(this.search)
            }).map(v => ({ text: `${v.type} ${v.id}`, value: v.id }))
        }
    },
    watch: {
        formData: {
            handler: function(newFormData) {
                if (!newFormData.downloadImmediately) this.formData.startGame = false
            },
            deep: true
        }
    },
    data: () => ({
        showRelease: true,
        showSnapShot: false,
        search: "",
        loading: false,
    }),
    methods: {
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
                        ) &&
                        this.canEditName
                    )
                        return this.$t("NameExisted");
                    return true;
                }
            ];
        },
        fillVersionName() {
            this.formData.name = this.formData.version;
        }
    }
};
</script>

<style scoped></style>
