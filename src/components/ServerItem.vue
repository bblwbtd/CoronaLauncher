<template>
    <v-list-item>
        <v-list-item-avatar tile>
            <v-img :src="detail.favicon" v-if="detail.favicon" />
            <v-progress-circular indeterminate class="mr-5" v-else />
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title>{{ server.title }}</v-list-item-title>
            <v-list-item-subtitle
                >{{ `${$t("Version")}:${server.version}` }}
                {{
                    `${$t("Player")}:${detail.players.online}/${
                        detail.players.max
                    }`
                }}
                {{ `${$t("Latency")}:${latency}ms` }}</v-list-item-subtitle
            >
        </v-list-item-content>
        <v-list-item-action >
            <div>
                <v-btn icon color="red" v-if="!readOnly">
                    <v-icon @click="() => onDelete(server.id)">
                        mdi-delete
                    </v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon size="20" @click="copyServer">
                        mdi-content-copy
                    </v-icon>
                </v-btn>
                <v-btn icon @click="refresh" :disabled="refreshing" >
                    <v-icon>
                        mdi-refresh
                    </v-icon>
                </v-btn>
                <v-btn icon @click="() => onEdit(server.id)" v-if="!readOnly">
                    <v-icon>
                        mdi-tune
                    </v-icon>
                </v-btn>
                <v-btn icon @click="() => onLaunch(server)" v-if="!readOnly">
                    <v-icon>
                        mdi-play
                    </v-icon>
                </v-btn>
            </div>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
import { clipboard } from 'electron';
import { pingServerLatency, pingServerList } from "../scripts/ping";
import { encodeServerInfo } from '../scripts/protocol'
 
export default {
    props: {
        server: Object,
        onLaunch: Function,
        onDelete: Function,
        onEdit: Function,
        readOnly: Boolean
    },
    mounted() {
        this.refresh()
    },
    data() {
        return {
            latency: "--",
            detail: {
                players: {
                    max: "--",
                    online: "--"
                },
                description: "--"
            },
            refreshing: false
        };
    },
    methods: {
        async refresh() {
            this.refreshing = true
            await Promise.all([
                this.updateServerLatency(),
                this.updateServerDetail()
            ])
            this.refreshing = false
        },
        async updateServerLatency() {
            const newLatency = await pingServerLatency(this.server.host);
            console.log(newLatency);
            if (newLatency !== "unknown") {
                this.latency = newLatency;
            } else {
                this.latency = 99999;
            }
        },
        async updateServerDetail() {
            const response = await pingServerList(this.server.host, this.server.port);
            console.log(response);
            this.detail = { ...this.detail, ...response };
        },
        copyServer() {
            clipboard.writeText(encodeServerInfo(this.server))
        }
    }
};
</script>

<style></style>
