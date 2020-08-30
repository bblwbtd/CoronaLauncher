<template>
    <v-dialog width="400" v-model="visible">
        <v-card>
            <v-card-title id="content">
                <v-row
                    no-gutters
                    align-content="center"
                    justify="center"
                    class="fill-height"
                >
                    <div id="item">
                        <v-progress-circular
                            v-if="
                                [
                                   'validating',
                                   'launching'
                                ].includes(state)
                            "
                            color="primary"
                            size="50"
                            indeterminate
                        >
                        </v-progress-circular>
                        <v-progress-circular
                            v-if="state === 'downloading'"
                            :value="progress"
                            color="primary"
                            size="50"
                            rotate="-90"
                        >
                            {{ Math.ceil(progress) }}
                        </v-progress-circular>
                        <v-icon
                            v-if="state === 'missingResources'"
                            color="red"
                            size="50"
                        >
                            mdi-file-alert-outline
                        </v-icon>
                        <v-icon
                            v-if="state === 'failed'"
                        >
                        
                        </v-icon>
                        <div class="mt-5" style="text-align: center">
                            {{ description }}
                        </div>
                    </div>
                </v-row>
            </v-card-title>
            <v-card-actions v-if="state === $t('MissingResources')">
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="cancel">{{
                    $t("Cancel")
                }}</v-btn>
                <v-btn color="green" text @click="downloadDependenceAndStart">{{
                    $t("DownloadAndStart")
                }}</v-btn>
            </v-card-actions>
            <v-card-actions v-if="state === $t('Downloading')">
                <v-spacer></v-spacer>
                <v-btn @click="cancel" color="red" text>
                    {{ $t("Cancel") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import fs from "fs";
import { scheduleDownloadTasks } from "../scripts/common";
import { validateResources, launch } from "../scripts/launcher";

export default {
    name: "LaunchDialog",
    computed: {},
    data: () => ({
        visible: false,
        state: 'validating',
        version: undefined,
        missingResources: [],
        missionID: null,
        progress: 0,
        timerID: undefined,
        versionDetail: undefined,
        description: ''
    }),
    methods: {
        cancel() {
            this.visible = false;
            const mission = this.$store.state.missions.find(
                mission => mission.id === this.missionID
            );
            if (mission) {
                mission.cancel();
                clearInterval(this.timerID);
            }
        },
        updateProgress() {
            const mission = this.$store.state.missions.find(
                mission => mission.id === this.missionID
            );
            if (!mission) return;

            const { tasks } = mission;
            const totalSize = tasks.reduce(
                (preious, current) => preious + current.size,
                0
            );
            const transferredSize = tasks.reduce(
                (previous, current) => previous + current.transferred,
                0
            );

            this.progress = (transferredSize / totalSize) * 100;
            console.log(this.progress);
        },
        async launch(version) {
            this.version = version;
            this.visible = true;
            this.state = 'validating';
            this.description = this.$t('ValidatingAsset')
            this.versionDetail = JSON.parse(
                fs.readFileSync(version.detailFilePath).toString()
            );

            this.missingResources = await validateResources(
                this.versionDetail,
                version.name
            );
            console.log(this.missingResources);

            if (this.missingResources.length) {
                this.state = 'missingResources';
                this.description = this.$t('MissingResources')
            } else {
                this.state = 'launching';
                this.description = this.$t('Launching')
                try {
                    await launch(this.versionDetail);
                } catch(err) {
                    console.log(err)
                }
                this.visible = false
            }
        },
        async downloadDependenceAndStart() {
            this.progress = 0;
            this.timerID = setInterval(() => {
                this.updateProgress();
            }, 500);
            this.missionID = await scheduleDownloadTasks({
                store: this.$store,
                name: this.version.name,
                tasks: this.missingResources,
                callback: async () => {
                    this.progress = 100;
                    this.state = 'launching';
                    clearInterval(this.timerID);
                    try {
                        await launch(this.versionDetail);
                    } catch (err) {
                        console.log(err)
                    }
                }
            });
            console.log(this.missionID);
            this.state = 'downloading';
        }
    }
};
</script>

<style scoped>
#content {
    height: 200px;
}
#item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
