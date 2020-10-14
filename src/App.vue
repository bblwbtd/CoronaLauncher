<template>
    <v-app>
        <AppBar></AppBar>
        <Drawer />
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import Drawer from "@/components/Drawer.vue";
import AppBar from "./components/AppBar";
import { getConfig } from "./scripts/config";
import { checkAccount } from "./scripts/login";
import { updateVersionManifest } from "./scripts/downloader/version";

export default {
    name: "Home",
    components: {
        Drawer,
        AppBar
    },
    data: () => ({
        config: {}
    }),
    methods: {
        
    },
    mounted() {
        this.$i18n.locale = getConfig().language;
        this.$store.dispatch("refreshVersions");
        this.$store.dispatch("refreshConfig");
        if (!this.$store.state.config.debug) {
            checkAccount(this.$store);
        }
        updateVersionManifest();
    }
};
</script>

<style>
@import "global.css";

#content {
    height: 100vh;
}
</style>
