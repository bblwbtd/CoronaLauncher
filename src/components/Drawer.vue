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
                <CommonAvatar size="32px" :name="$store.state.config.currentAccount.profile.name" />
            </v-list-item>
            <v-divider />
            <v-list-item :key="item.title" v-for="item in menu" @click="item.onClick">
                <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{$t(item.title)}}</v-list-item-title>
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
    data(ins) {
        return {
            accountStatus: '',
            menu: [
                {
                    icon: 'mdi-home',
                    title: 'Home',
                    onClick: () => ins.switch('/')
                },
                {
                    icon: 'mdi-server',
                    title: 'Server',
                    onClick: () => ins.switch('/servers')
                },
                {
                    icon: 'mdi-minecraft',
                    title: 'Versions',
                    onClick: () => ins.switch('/versions')
                },
                {
                    icon: 'mdi-cogs',
                    title: 'Config',
                    onClick: () => ins.switch('/config')
                }
            ]
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
