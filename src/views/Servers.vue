<template>
    <v-container class="align-content-start justify-center fill-height" fluid>
        <v-app-bar app>
            <v-toolbar-title>{{ $t("Server") }}</v-toolbar-title>
            <v-spacer />
            <DownloadButton />
        </v-app-bar>
        <v-row class="justify-center">
            <v-col cols="12" md="8" lg="6">
                <ServerList
                    :servers="$store.state.config.servers || []"
                    class="mt-3"
                    :onLaunch="onLaunch"
                    :onDelete="onDelete"
                    :onEdit="onEdit"
                    v-if="this.$store.state.config.servers.length > 0"
                />
                <div v-else>{{ $t("NoData") }}</div>
            </v-col>
        </v-row>
        <v-speed-dial v-model="openMenu" @click="openMenu = !openMenu" class="float-btn green">
            <template v-slot:activator>
                <v-btn :ripple="false" icon large color="white">
                    <v-icon>{{ openMenu ? 'mdi-close' : 'mdi-plus'}}</v-icon>
                </v-btn>
            </template>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="showNewServerForm(0)" icon fab class="orange" color="white" small v-on="on" v-bind="attrs">
                        <v-icon>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{$t('NewServerManually')}}</span>
            </v-tooltip>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="showNewServerForm(1)" icon fab class="blue" color="white" small v-on="on" v-bind="attrs">
                        <v-icon>
                            mdi-link
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{$t('ImportFromLink')}}</span>
            </v-tooltip>
            <!-- <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon fab class="pink" color="white" small v-on="on" v-bind="attrs">
                        <v-icon>
                            mdi-qrcode
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{$t('ImportFromQR')}}</span>
            </v-tooltip> -->
        </v-speed-dial>
        <LaunchDialog ref="launchDialog" />
        <CommonDialog
            width="500"
            v-model="deleteVisible"
            :content="deleteContent"
            :title="$t('DeleteConfirm')"
        >
            <v-btn text color="green" @click="() => (deleteVisible = false)">{{
                $t("Cancel")
            }}</v-btn>
            <v-btn text color="red" @click="handleDeleteServer">{{
                $t("Confirm")
            }}</v-btn>
        </CommonDialog>
        <v-dialog eager width="500" v-model="newServerFormiVsible">
            <v-card>
                <v-card-title>
                   {{newServerFormTitle}}
                </v-card-title>
                <v-card-text>
                    <ServerConfigForm ref="serverConfigForm" v-show="formType === 0"></ServerConfigForm>
                    <ServerLinkImportForm ref="serverLinkForm" v-show="formType === 1"></ServerLinkImportForm>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="() => (newServerFormiVsible = false)"
                        color="red"
                    >
                        {{ $t("Cancel") }}
                    </v-btn>
                    <v-btn @click="handleNewServer" color="green">
                        {{ $t("Confirm") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import ServerList from "../components/ServerList";
import DownloadButton from "../components/DownloadButton";
import LaunchDialog from "../components/LaunchDialog";
import CommonDialog from "../components/CommonDialog";
import ServerConfigForm from "../components/ServerConfigForm";
import ServerLinkImportForm from "../components/ServerLinkImportForm"
import { v4 } from "uuid";

export default {
    components: {
        ServerList,
        DownloadButton,
        LaunchDialog,
        CommonDialog,
        ServerConfigForm,
        ServerLinkImportForm
    },
    watch: {
        newServerFormiVsible: function(val) {
            if (!val) {
                this.$refs.serverConfigForm.reset();
                this.$refs.serverLinkForm.reset();
            }
        }
    },
    data(ins) {
        return {
            deleteVisible: false,
            deleteContent: "",
            defaultServerConfig: undefined,
            openMenu: false,
            newServerFormiVsible: false,
            newServerFormTitle: ins.$t("NewServer"),
            formType: 0,
        };
    },
    methods: {
        onLaunch(server) {
            const version = this.$store.state.versions.find(
                v => v.name === server.version
            );
            this.$refs.launchDialog.launch(version, server.host, server.port);
        },
        onDelete(id) {
            this.id = id;
            this.deleteVisible = true;
            this.deleteContent = `${this.$t(
                "DoYouReallyWantToDeleteThis"
            )}`;
        },
        handleDeleteServer() {
            const config = this.$store.state.config;
            config.servers = config.servers.filter(s => s.id !== this.id);
            this.$store.commit("setConfig", config);
            this.deleteVisible = false;
        },
        showNewServerForm(formType) {
            this.formType = formType
            this.newServerFormTitle = this.$t("NewServer")
            this.newServerFormiVsible = true;
        },
        handleNewServer() {
            const config = this.$store.state.config;
            
            let formData 
            switch (this.formType) {
                case 0:
                    formData = this.$refs.serverConfigForm.formData;
                    break;
                case 1:
                    formData = this.$refs.serverLinkForm.getServerInfo();
                    delete formData.id
                    break
                default:
                    return
            }
            if (formData.id) {
                for (let i = 0; i < config.servers.length; i += 1) {
                    const server = config.servers[i];
                    if (server.id === formData.id) {
                        config.servers[i] = formData;
                    }
                    config.servers = [...config.servers];
                }
            } else {
                config.servers.push({
                    id: v4(),
                    ...formData
                });
            }

            this.$store.commit("setConfig", config);
            this.newServerFormiVsible = false;
        },
        onEdit(id) {
            this.formType = 0
            this.newServerFormTitle = this.$t("EditServer")
            this.newServerFormiVsible = true;
            const server = this.$store.state.config.servers.find(
                s => s.id === id
            );
            this.$refs.serverConfigForm.formData = { ...server };
        }
    }
};
</script>

<style scoped>
.item {
    display: flex;
    flex-direction: column;
}
</style>
