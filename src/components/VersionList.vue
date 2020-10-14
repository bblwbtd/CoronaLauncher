<template>
    <v-list
        v-if="
            $store.state.versions.length > 0
        "
    >
        <v-list-item
            :key="version.name"
            v-for="version in $store.state.versions"
        >
            <v-list-item-content>{{ version.name }}</v-list-item-content>
            <v-list-item-action>
                <div style="display: flex">
                    <v-btn
                        icon
                        @click="
                            () =>
                                $router.push({
                                    path: '/versions/config',
                                    query: { version: version.name }
                                })
                        "
                    >
                        <v-icon>mdi-tune</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="red"
                        @click="() => showDeleteDialog(version.name)"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon @click="() => launch(version)">mdi-play</v-icon>
                    </v-btn>
                </div>
            </v-list-item-action>
        </v-list-item>
        <CommonDialog
            width="500"
            v-model="deleteVisible"
            :content="deleteContent"
            :title="$t('DeleteConfirm')"
        >
            <v-btn text color="green" @click="() => (deleteVisible = false)">{{
                $t("Cancel")
            }}</v-btn>
            <v-btn text color="red" @click="handleDeleteVersion">{{
                $t("Confirm")
            }}</v-btn>
        </CommonDialog>
        <LaunchDialog ref="launchDialog" />
    </v-list>
</template>

<script>
import CommonDialog from "./CommonDialog";
import { removeVersion } from "../scripts/versions";
import LaunchDialog from "./LaunchDialog";

export default {
    components: {
        CommonDialog,
        LaunchDialog
    },
    data: () => ({
        deleteContent: "",
        deleteVisible: false,
        deleteTarget: ""
    }),
    mounted() {
        this.$store.dispatch('refreshVersions')
    },
    methods: {
        showDeleteDialog(version) {
            this.deleteContent = `${this.$t(
                "DoYouReallyWantToDeleteThis"
            )}(${version})`;
            this.deleteVisible = true;
            this.deleteTarget = version;
        },
        handleDeleteVersion() {
            removeVersion(this.deleteTarget);
            this.deleteVisible = false;
            this.$store.dispatch("refreshVersions");
        },
        launch(version) {
            this.$refs.launchDialog.launch(version);
        }
    }
};
</script>

<style scoped></style>
