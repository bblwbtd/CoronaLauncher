<template>
    <v-navigation-drawer width="200" id="drawer" app permanent>
        <v-list>
            <v-list-item v-if="!$store.state.config.currentAccount" style="margin-bottom: 12px">
                <v-btn
                    @click="() => $router.push('/login')"
                    block
                    id="login"
                    class="text--white"
                >{{$t('Login')}}</v-btn>
            </v-list-item>
            <v-list-item
                @click="goAccountConfig" 
                v-if="$store.state.config.currentAccount"
                style="padding-left: 12px; margin-bottom: 12px"
            >
                <v-list-item-title>
                    {{$store.state.config.currentAccount.profile.name}}
                    <v-list-item-subtitle>{{$store.state.config.currentAccount.type}}{{accountStatus ? `(${accountStatus})` : ''}}</v-list-item-subtitle>
                </v-list-item-title>
                <v-spacer />
                <v-list-item-avatar>
                    <CommonAvatar :name="$store.state.config.currentAccount.profile.name" />
                </v-list-item-avatar>
            </v-list-item>
            <v-divider />
            <v-list-item key="1" @click="() => this.switch('/')">
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{$t('Home')}}</v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="() => this.switch('/installation')">
                <v-list-item-icon>
                    <v-icon>mdi-cloud</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{$t('Installation')}}</v-list-item-title>
            </v-list-item>
            <v-list-item key="3" @click="() => this.switch('/config')">
                <v-list-item-icon>
                    <v-icon>mdi-cogs</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{$t('Config')}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import CommonAvatar from './CommonAvatar'

export default {
    components: {
        CommonAvatar,
    },
    watch: {
        
    },
    data() {
        return {
            accountStatus: ''
        }
    },
    methods: {
        switch(name) {
            if (this.$router.currentRoute.path !== name) {
                this.$router.push(name)
            }
        },
        goAccountConfig() {
            this.$store.commit('setTab', 1)
            this.switch('/config')
        }
    }
}
</script>

<style>
#login {
    background-color: green;
    color: white;
}

#drawer {
    background-color: #272525;
}
</style>
