<template>
    <v-container fluid class="fill-height">
        <v-app-bar flat app>
            <BackButton />
            <v-toolbar-title style="padding-left: 3px">{{
                $t("Login")
            }}</v-toolbar-title>
        </v-app-bar>
        <v-row justify="center">
            <v-col cols="10" md="8" lg="6">
                <LoginForm
                    :formData="formData"
                    :canEditType="canEditType"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import LoginForm from "../components/LoginForm";
import BackButton from "../components/BackButton";

export default {
    components: {
        LoginForm,
        BackButton
    },
    props: {
        username: String,
        password: String,
        type: String,
        canEditType: Boolean,
    },
    mounted() {
        this.formData = {
            username: this.username,
            password: this.password,
            type: this.type
        };
    },
    data: () => ({
        formData: {}
    })
};
</script>

<style></style>
