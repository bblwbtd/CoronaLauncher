<template>
    <div style="height: 100%" dense>
        <div id="no_item" v-if="!$store.state.missions.length">
            <div>{{$t('NoDownloadMission')}}</div>
        </div>
        <v-card
            class="mb-5"
            :key="mission.id"
            v-for="mission in $store.state.missions"
        >
            <v-card-title>
                {{mission.name}}
                {{getState(mission)}} 
            </v-card-title>
            <v-card-text>
                <div style="display:flex">
                    <div style="font-size: 15px">{{getProgress(mission)}}</div>
                </div>
                <v-progress-linear class="mb-5" :value="getValue(mission)"></v-progress-linear>
                <v-btn
                    small
                    color="blue accent-1"
                    v-if="mission.state === 'Downloading'"
                    @click="() => showCancellationDialog(mission)"
                >{{$t('Cancel')}}</v-btn>
                <v-btn
                    small
                    color="blue accent-1"
                    v-if="['Failed', 'Cancelled'].includes(mission.state)"
                    @click="() => retryMission(mission)"
                >{{$t('Retry')}}</v-btn>
            </v-card-text>
        </v-card>
        <CommonDialog
            width="500"
            v-model="visible"
            :title="$t('CancellationConfirm')"
            :content="cancellationContent"
        >
            <v-btn color="green" text @click="() => visible = false">{{$t('Cancel')}}</v-btn>
            <v-btn color="red" text @click="cancelMission">{{$t('Confirm')}}</v-btn>
        </CommonDialog>
    </div>
</template>

<script>
import CommonDialog from '../components/CommonDialog'

export default {
    data: () => ({
        visible: false,
        cancellationContent: '',
        cancellationTarget: undefined,
    }),
    components: {
        CommonDialog,
    },
    methods: {
        analyse(mission) {
            const { tasks } = mission
            const totalTaskNumber = tasks.length
            const totalSize = tasks.reduce((preious, current) => preious + current.size, 0)
            const transferredSize = tasks.reduce((previous, current) => previous + current.transferred, 0)
            return { totalTaskNumber, totalSize, transferredSize }
        },
        getProgress(mission) {
            const { 
                getSuccessfulTasks, 
                getFailedTasks
            } = mission
            const { totalTaskNumber, totalSize, transferredSize } = this.analyse(mission)
            const bytes2MegaBytes = (bytes) => {
                return (bytes / 1048576).toFixed(2)
            }
            return `${this.$t('Total')}:${totalTaskNumber} ${this.$t('Success')}:${getSuccessfulTasks().length} ${this.$t('Fail')}:${getFailedTasks().length} ${bytes2MegaBytes(transferredSize)}MB/${bytes2MegaBytes(totalSize)}MB`
        },
        getValue(mission) {
            const { transferredSize, totalSize } = this.analyse(mission)
            if (!totalSize) return 0
            return (transferredSize / totalSize) * 100
        },
        getState(mission) {
            switch (mission.state) {
                case 'ValidatingAsset':
                    return this.$t('ValidatingAsset')
                case 'ValidatingLibrary':
                    return this.$t('ValidatingLibrary')
                case 'ValidatingClient':
                    return this.$t('ValidatingClient')
                case 'Success':
                    return this.$t('Success')
                case 'Downloading':
                    return this.$t('Downloading')
                case 'Pending':
                    return this.$t('Pending')
                case 'Fail':
                    return this.$t('Fail')
                case 'Cancelled':
                    return this.$t('Cancelled')
            }
        },
        showCancellationDialog(mission){
            this.visible = true
            this.cancellationTarget = mission
            this.cancellationContent = `${this.$t('DoYouReallyWantToCancelTheDownload')}(${mission.name})`
        },
        cancelMission(){
            this.visible = false
            this.cancellationTarget.cancel()
        },
        retryMission(mission) {
            mission.retry()
        }
    }
}
</script>

<style scoped>
#no_item {
    display: flex;
    align-items: center;
    height: 100%;
    text-align: center;
    justify-content: center;
}
</style>