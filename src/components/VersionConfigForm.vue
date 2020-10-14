<template>
    <v-form ref="form">
        <VersionSelect 
            @change="fillVersionName"
            v-model="formData.version"
            :disabled="!canEditVersion"
            :versions="versions"
        />
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
import VersionSelect from './VersionSelect'

export default {
    components: {
        VersionSelect
    },
    mounted() {
        console.log(this.versions)
    },
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
