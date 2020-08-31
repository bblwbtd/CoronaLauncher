<template>
    <div>
        <v-list
            v-if="$store.state.config.accounts.length > 0"
            rounded
            nav
            style="padding-bottom: 0"
            flat
            dense
            subheader
        >
            <v-radio-group hide-details v-model="selected">
                <v-list-item-group>
                    <v-list-item
                        :ripple="false"
                        two-line
                        :key="account.id"
                        v-for="account in $store.state.config.accounts"
                    >
                        <v-list-item-action style="margin-right: 12px">
                            <v-radio :ripple="false" :key="account.id" :value="account.id" />
                        </v-list-item-action>
                        <CommonAvatar size="28px" class="mr-3" :name="account.profile.name" />
                        <v-list-item-content>
                            <v-list-item-title>{{`${account.username}${ account.type === 'Mojang' ? `(${account.profile.name})`: ''}`}}</v-list-item-title>
                            <v-list-item-subtitle>{{account.type}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon>
                                <v-icon
                                    color="red"
                                    @click="() => show_delete_account(account)"
                                >mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-radio-group>
        </v-list>
        <v-btn
            @click="() => $router.push('/login')"
            class="mt-3"
            block
            color="green"
        >{{$t('NewAccount')}}</v-btn>
        <CommonDialog
            :title="$t('DeleteConfirm')"
            :content="deleteText"
            v-model="visible"
            width="500"
        >
            <v-btn text color="green" @click="() => visible = false">{{$t('Cancel')}}</v-btn>
            <v-btn text color="red" @click="delete_account">{{$t('Confirm')}}</v-btn>
        </CommonDialog>
    </div>
</template>

<script>
import CommonDialog from './CommonDialog'
import CommonAvatar from './CommonAvatar'

export default {
    name: 'AccountConfig',
    components: {
        CommonDialog,
        CommonAvatar
    },
    mounted() {
        this.config = this.$store.state.config
        if (this.config.currentAccount) {
            this.selected = this.config.currentAccount.id
        }
    },
    watch: {
        selected: function(newSelected) {
            this.config.currentAccount = this.config.accounts.find(account => account.id === newSelected)
            this.$store.commit('setConfig', this.config)
        }
    },
    data() {
        return {
            visible: false,
            config: {
                accounts: []
            },
            selected: '',
            deleteText: '',
            deleteTarget: {},
        }
    },
    methods: {
        show_delete_account(target){
            this.deleteText =  `${this.$t('DoYouReallyWantToDeleteThis')}(${target.username})`
            this.deleteTarget = target
            this.visible = true
        },
        delete_account() {
            this.config.accounts = this.config.accounts.filter(account => account.id !== this.deleteTarget.id)
            if (this.config.currentAccount.id === this.deleteTarget.id) {
                this.config.currentAccount = this.config.accounts[0] || null
            }
            console.log(this.config)
            this.$store.commit('setConfig', this.config)
            this.visible = false
        }
    }
}
</script>

<style scoped>
</style>