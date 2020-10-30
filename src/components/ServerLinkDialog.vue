<template>
    <v-dialog v-on="$listeners" v-bind="$attrs">
        <v-card>
            <v-card-title>{{ $t("JoinServer") }}</v-card-title>
            <v-card-text>
                <ServerItem :server="server" readOnly></ServerItem>
                <LocalVersionSelect
                    v-if="showSelect"
                    :placeholder="$t('Versions')"
                    v-model="selectedVersion"
                    :filter="v => this.server && v.baseVersion.id === this.server.version"
                />
                <v-checkbox :label="$t('SaveServer')" v-model="saveServer" />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="() => $emit('cancel')">{{ $t("Cancel") }}</v-btn>
                <v-btn color="green" @click="() => launch()">{{ $t("Play") }}</v-btn>
            </v-card-actions>
        </v-card>
        <LaunchDialog ref="dialog"></LaunchDialog>
    </v-dialog>
</template>

<script>
import ServerItem from "./ServerItem";
import LocalVersionSelect from "./LocalVersionSelect";
import { installNewVersion, readAllVersions } from "../scripts/versions";
import LaunchDialog from './LaunchDialog'
import { v4 } from 'uuid'

export default {
    components: {
        ServerItem,
        LocalVersionSelect,
        LaunchDialog
    },
    props: {
        server: Object
    },
    computed: {
        showSelect: function() {
            if (this.versions) {
                return this.versions.length > 1
            }
            return false
        }
    },
    data(ins) {
        return {
            save: false,
            versions: ins.$store.state.versions
                .filter(v => v.baseVersion.id === this.server.version)
                .map(v => v.name),
            selectedVersion: this.server ? this.server.version : undefined,
            saveServer: false
        };
    },
    methods: { 
        async launch() {
            let version = this.$store.state.versions.find(
                v => v.name === this.selectedVersion || this.server.version
            );
            if (!version) {
                await installNewVersion(this.selectedVersion);
                version = readAllVersions().find(
                    v => v.name === this.selectedVersion
                );
            }
            if (this.saveServer) {
                const config = this.$store.state.config
                config.servers.push({
                    id: v4(),
                    ...this.server
                });
                this.$store.commit('setConfig', config)
            }
            console.log(version)
            this.$emit('launching')
            this.$refs.dialog.launch(version, this.server.host, this.server.port);
        }
    }
};
</script>

<style></style>
