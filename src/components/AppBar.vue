<template>
    <v-system-bar app window dark id="bar">
        <div id="back">
            <div style="width: 84px" />
            <div style="user-select: none">{{$t('CoronaLauncher')}}</div>
            <div v-if="os === 'darwin'" style="width: 84px" />
            <div v-if="os !== 'darwin'">
                <v-icon size="small" class="op" @click="minimize">mdi-minus</v-icon>
                <v-icon size="small" class="op" @click="maximize" v-if="showMaximize"
                    >mdi-checkbox-blank-outline</v-icon
                >
                <v-icon size="small" class="op" @click="unMaximize" v-else
                    >mdi-checkbox-multiple-blank-outline</v-icon
                >
                <v-icon size="small" class="op" @click="close">mdi-close</v-icon>
            </div>
        </div>
    </v-system-bar>
</template>

<script>
const os = require("os");
const { remote } = require("electron");

export default {
    computed: {},
    mounted() {
        remote
            .getCurrentWindow()
            .on("maximize", () => {
                this.showMaximize = false;
            })
            .on("unmaximize", () => {
                this.showMaximize = true;
            });
    },
    data() {
        return {
            os: os.platform(),
            showMaximize: true,
        };
    },
    methods: {
        minimize() {
            remote.getCurrentWindow().minimize();
        },
        maximize() {
            remote.getCurrentWindow().maximize();
        },
        unMaximize() {
            remote.getCurrentWindow().unmaximize();
        },
        close() {
            remote.getCurrentWindow().close();
        },
    },
};
</script>

<style scoped>
#back{
    display: flex;
    justify-content: space-between;
    width: 100%;
}
#bar {
    background-color: #272525;
    padding: 0;
    -webkit-app-region: drag;
}
.op {
    -webkit-app-region: no-drag;
    cursor: pointer;
}
</style>