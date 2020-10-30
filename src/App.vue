<template>
    <v-app>
        <AppBar></AppBar>
        <Drawer />
        <ServerLinkDialog
            @launching="() => (showDialog = false)"
            @cancel="() => (showDialog = false)"
            width="500"
            :server="server"
            v-model="showDialog"
            refs="linkDialog"
        />
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import Drawer from "@/components/Drawer.vue";
import AppBar from "./components/AppBar";
import ServerLinkDialog from "./components/ServerLinkDialog";
import { getConfig } from "./scripts/config";
import { checkAccount } from "./scripts/login";
import { updateVersionManifest } from "./scripts/downloader/version";
import { ipcRenderer } from "electron";
import { decodeLink } from "./scripts/protocol";

export default {
    name: "Home",
    components: {
        Drawer,
        AppBar,
        ServerLinkDialog
    },
    data: () => ({
        showDialog: false,
        config: {},
        server: undefined
    }),
    methods: {
        launchGame(version) {
            this.$refs.launchDialog.launch(version);
        },
        handleMessage(event, data) {
            console.log(data);
            this.server = decodeLink(data);
            console.log(this.server);
            this.showDialog = true;
        }
    },
    mounted() {
        this.$i18n.locale = getConfig().language;
        this.$store.dispatch("refreshVersions");
        this.$store.dispatch("refreshConfig");
        if (!this.$store.state.config.debug) {
            checkAccount(this.$store);
        }
        updateVersionManifest();

        ipcRenderer.on("server", this.handleMessage);
    },
    destroyed() {
        ipcRenderer.removeAllListeners("server");
    }
};
</script>

<style>
@import "global.css";

#content {
    height: 100vh;
}
</style>
