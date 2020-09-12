<template>
    <v-card>
        <v-card-text>
            <v-form ref="form">
                <v-row>
                    <v-col cols="12">
                        <v-select
                            :label="$t('AccountType')"
                            v-model="formData.type"
                            :items="accountType"
                            :disabled="!canEditType"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            :rules="[v => (v ? true : $t('CanNotBeEmpty'))]"
                            :label="$t('Username')"
                            v-model="formData.username"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="formData.type === 'mojang'">
                        <v-text-field
                            :rules="[v => (v ? true : $t('CanNotBeEmpty'))]"
                            :label="$t('Password')"
                            v-model="formData.password"
                            type="password"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-btn
                            @click="addAccount"
                            block
                            color="green"
                            :loading="loading"
                            >{{ buttonText }}</v-btn
                        >
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <CommonSnackbar ref="snackbar" />
    </v-card>
</template>

<script>
import { getConfig } from "../scripts/config";
import CommonSnackbar from "./CommonSnackbar";
import { officialLogin } from "../scripts/login";
import { v4 } from "uuid";

export default {
    name: "LoginForm",
    components: {
        CommonSnackbar
    },
    props: {
        formData: {
            type: Object,
            default: () => ({
                type: "Mojang"
            })
        },
        canEditType: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        config: getConfig(),
        accountType: ["mojang", "offline"],
        loading: false,
        originalFormData: {}
    }),
    watch: {
        formData: function() {
            console.log(this.formData);
            this.originalFormData = { ...this.formData };
        }
    },
    computed: {
        buttonText: function() {
            if (this.originalFormData.username) {
                return this.$t("Save");
            }
            return this.formData.type === "mojang"
                ? this.$t("Login")
                : this.$t("Add");
        }
    },
    mounted() {},
    methods: {
        async addAccount() {
            const handler = async () => {
                if (!this.$refs.form.validate()) {
                    return;
                }
                const account = this.config.accounts.find(
                    account =>
                        account.username === this.formData.username &&
                        account.type === this.formData.type
                );
                this.config.accounts = this.config.accounts.filter(
                    account =>
                        account.username !== this.originalFormData.username ||
                        account.type !== this.originalFormData.type
                );
                switch (this.formData.type) {
                    case "offline":
                        if (account) {
                            this.$refs.snackbar.show(this.$t("ExistedAccount"));
                            return;
                        }
                        this.config.accounts = [
                            {
                                id: v4(),
                                type: "offline",
                                username: this.formData.username,
                                profile: {
                                    name: this.formData.username
                                }
                            }
                        ].concat(this.config.accounts);
                        break;
                    case "mojang":
                        try {
                            const response = await officialLogin(
                                this.formData.username,
                                this.formData.password
                            );
                            console.log("login successfully");
                            this.config.accounts = [
                                {
                                    id: v4(),
                                    type: "mojang",
                                    username: this.formData.username,
                                    accessToken: response.accessToken,
                                    profile: response.selectedProfile,
                                    password: this.formData.password
                                }
                            ].concat(this.config.accounts);
                        } catch (e) {
                            console.log(e);
                            this.$refs.snackbar.show(this.$t("LoginFailed"));
                            return;
                        }
                        this.$store.commit("setAccountState", "valid");
                        break;
                }
                this.config.currentAccount = this.config.accounts[0];
                this.$store.commit("setConfig", this.config);
                this.$router.go(-1);
            };
            this.loading = true;
            await handler();
            this.loading = false;
        }
    }
};
</script>

<style></style>
