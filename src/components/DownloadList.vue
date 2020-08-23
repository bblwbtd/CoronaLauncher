<template>
    <div style="height: 100%" dense>
        <div id="no_item" v-if="!$store.state.downloadingMission.length && !$store.state.finishedMission.length">
            <div>{{$t('NoDownloadMission')}}</div>
        </div>
        <v-card
            class="mb-5"
            :key="mission.id"
            v-for="mission in [...$store.state.downloadingMission, ...$store.state.finishedMission]"
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
                    color="blue accent-1"
                    v-if="['Failed', 'Canceled'].includes(mission.state)"
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
            <v-btn color="red" text @click="cancelTask">{{$t('Confirm')}}</v-btn>
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
        aggregate(missions, field) {
            return missions.reduce((preview, current) => preview + current[field], 0)
        },
        analyse(mission) {
            const { success, failed, downloadingTasks, remainingTasks } = mission
            console.log(mission)
            const totalTaskNumber = success.length + failed.length + downloadingTasks.length + remainingTasks.length
            const tempArray = [success, failed, downloadingTasks, remainingTasks]
            const totalSize = tempArray.reduce((preious, current) => preious + this.aggregate(current, 'size'), 0)
            const transferredSize = tempArray.reduce((previous, current) => previous + this.aggregate(current, 'transferred'), 0)
            return { totalTaskNumber, totalSize, transferredSize }
        },
        getProgress(mission) {
            const { success, failed } = mission
            const { totalTaskNumber, totalSize, transferredSize } = this.analyse(mission)
            const bytes2MegaBytes = (bytes) => {
                return (bytes / 1048576).toFixed(2)
            }
            return `${this.$t('Total')}:${totalTaskNumber} ${this.$t('Success')}:${success.length} ${this.$t('Fail')}:${failed.length} ${bytes2MegaBytes(transferredSize)}MB/${bytes2MegaBytes(totalSize)}MB`
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
            }
        },
        showCancellationDialog(mission){
            this.visible = true
            this.cancellationTarget = mission
            this.cancellationContent = `${this.$t('DoYouReallyWantToCancelTheDownload')}(${mission.name})`
        },
        cancelTask(){
            this.visible = false
            this.cancellationTarget.cancel()
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