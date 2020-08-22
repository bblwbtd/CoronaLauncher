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
                    <v-checkbox v-model="showRelease" class="mr-3" :label="$t('Release')" />
                    <v-checkbox v-model="showSnapShot" class="mr-3" :label="$t('Snapshot')" />
                    <v-text-field v-model="search" :placeholder="$t('Search')" />
                </v-list-item>
            </template>
            <template v-slot:no-data>
                <v-list-item>{{$t('NoData')}}</v-list-item>
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
        <v-btn color="green" :loading="loading" @click="handleSave">{{$t('Save')}}</v-btn>
    </v-form>
</template>

<script>
import { fetchVersionManifest, fetchVersionDetail, writeVersionDetail } from '../scripts/downloader/version'
import {
  validateAllAsset,
  validateAssetIndex,
  downloadAssetIndex,
  transformAssetObjects2Task
} from '../scripts/downloader/asset.js'
import {
  validateClient,
  getClientDownloadTask
} from '../scripts/downloader/client'
import { v4 } from 'uuid'
import { validateAllDependencies, transformLibraries2Tasks } from '../scripts/downloader/library'
import { patchDownload } from '../scripts/common'
import { copyClient } from '../scripts/client'

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
        this.manifest = await fetchVersionManifest()
        this.fetchVersions()
    },
    watch: {
        showRelease: function() {
            this.fetchVersions()
        },
        showSnapShot: function() {
            this.fetchVersions()
        },
        search: function() {
            this.fetchVersions()
        }
    },
    data: () => ({
        versions: [],
        manifest: {},
        showRelease: true,
        showSnapShot: false,
        search: '',
        loading: false,
    }),
    methods: {
        async fetchVersions() {
            try {
                const results = []
                this.manifest.versions.forEach(version => {
                    const { type, id } = version
                    if ((type === 'snapshot' && this.showSnapShot) || (type === 'release' && this.showRelease)) {
                        results.push({
                            text: `${type} ${id}`,
                            value: id
                        })
                    }
                })
                this.versions = results.filter(data => data.text.includes(this.search))
            } catch(e) {
                this.$emit('error', e)
            }
        },
        versionNameRule() {
            return [
                (value) => {
                    if (!value) return this.$t('CanNotBeEmpty')
                    return true
                },
                (value) => {
                    if (this.$store.state.versions.find(version => version.name === value)) return this.$t('NameExisted')
                    return true
                }
            ]
        },
        fillVersionName() {
            this.formData.name = this.formData.version
        },
        async handleSave() {
            if (this.formData.downloadImmediately) {
                this.loading = true
                const versionMeta =  this.manifest.versions.find(version => version.id === this.formData.version)
                const versionDetail = await fetchVersionDetail(versionMeta.url)
                await writeVersionDetail(JSON.stringify(versionDetail))
                await this.validateAndDownloadGame(versionDetail)
                this.loading = false
            }
        },
        async validateAndDownloadGame(versionDetail) {
            const store = this.$store
            const formData = this.formData
            
            const mission = {
                id: v4(),
                state: 'Pending',
                name: formData.name,
                success: [], 
                failed: [], 
                downloadingTasks: [], 
                remainingTasks: [],
            }
            
            const updateState = (state) => {
                store.commit('updateDownloadMissionState', {
                    missionID: mission.id,
                    missionState: state
                })
            }

            if (!validateAssetIndex(versionDetail)) {
                const [promise] = downloadAssetIndex(versionDetail)
                await promise
            }

            const assetDownloadTasks = transformAssetObjects2Task(validateAllAsset(versionDetail))

            const libraryDownloadTasks = transformLibraries2Tasks(validateAllDependencies(versionDetail))

            const hasClient = validateClient(versionDetail)

            const tasks = [...assetDownloadTasks, ...libraryDownloadTasks]
            if (!hasClient) {
                tasks.push(getClientDownloadTask(versionDetail))
            } else if(hasClient && versionDetail.id !== formData.name) {
                copyClient(versionDetail.id, formData.name)
            }

            // {
            //   downloadingTasks,
            //   remainingTasks,
            //   success,
            //   failed
            // }
            console.log(tasks)
            if (!tasks.length) {
                store.dispatch('refreshVersions')
                return
            }

            store.commit('addDownloadMission', mission)

            updateState('Downloading')
            const cancelRequest = patchDownload(tasks, {
                onProgress(progress) {
                    console.log(progress)
                    if (!progress.remainingTasks.length && !progress.downloadingTasks.length) {
                        if (progress.failed.length) {
                            mission.state = 'Fail'
                        } else {
                            mission.state = 'Success'
                        }
                        store.dispatch('finishMission', { ...mission, ...progress })
                        if (versionDetail.id !== formData.name) {
                            copyClient(versionDetail.id, formData.name)
                        }
                        store.dispatch('refreshVersions')
                        return
                    }
                    store.commit('updateDownloadMission', { ...mission, ...progress })
                }
            })

            const cancel = () => {
                updateState('Canceled')
                cancelRequest()
            }

            store.commit('updateDownloadMission', {cancel, id: mission.id})
        }
    }
}
</script>

<style scoped>
</style>