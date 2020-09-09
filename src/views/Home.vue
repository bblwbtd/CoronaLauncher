<template>
    <v-container
        style="padding: 0"
        fluid
        class="fill-height align-content-start justify-start"
    >
        <v-app-bar flat app>
            <v-toolbar-title>{{ $t("Home") }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <DownloadButton />
        </v-app-bar>
        <v-banner
            single-line
            id="banner"
            v-if="$store.state.accountState === 'loginFailed'"
            color="red"
        >
            {{ $t("LoginFialed") }}
            <template v-slot:actions="{}">
                <v-btn text @click="redirectLogin">{{
                    $t("LoginAgain")
                }}</v-btn>
                <v-btn
                    text
                    @click="$store.commit('setAccountState', 'dismiss')"
                >
                    {{ $t("Dismiss") }}
                </v-btn>
            </template>
        </v-banner>
        <v-img height="100%" src="../assets/minecraft.jpeg">
            <div id="content">
                <v-menu max-height="40vh" open-on-hover top offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            :ripple="false"
                            large
                            id="op"
                            v-on="on"
                            v-bind="attrs"
                            @click="launchLast"
                            :disabled="!$store.state.versions.length"
                        >
                            <div id="op_content">
                                <div>{{ $t("Play") }}</div>
                                <div style="font-size: 0.8rem">
                                    {{ $store.state.config.lastLaunch }}
                                </div>
                            </div>
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-item
                            @click="() => launchGame(version)"
                            :key="version.name"
                            v-for="version in $store.state.versions"
                        >
                            <v-list-item-content>
                                {{ version.name }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-img>
        <LaunchDialog ref="launchDialog"> </LaunchDialog>
    </v-container>
</template>

<script>
import DownloadButton from "../components/DownloadButton";
import LaunchDialog from "../components/LaunchDialog";

export default {
    name: "Home",
    components: {
        DownloadButton,
        LaunchDialog
    },
    mounted() {
        this.$store.dispatch("refreshConfig");
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        launchGame(version) {
            this.$refs.launchDialog.launch(version);
        },
        launchLast() {
            const last = this.$store.state.versions.find(
                version => version.name === this.$store.state.config.lastLaunch
            );
            this.$refs.launchDialog.launch(last);
        },
        redirectLogin() {
            const account = this.$store.state.config.currentAccount;
            this.$router.push({
                path: "/login",
                query: {
                    username: account.username,
                    type: "mojang"
                }
            });
        }
    }
};
</script>

<style scoped>
#op {
    position: absolute;
    bottom: 60px;
    width: 200px;
    height: 64px;
    background-image: url("../assets/button.png");
    background-position: center;
    background-size: contain;
    font-size: 1rem;
}
#op_content {
    display: flex;
    flex-direction: column;
}
#content {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
}
#banner {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
}
</style>
