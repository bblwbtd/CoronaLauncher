<template>
    <v-container fluid class="fill-height">
        <v-app-bar flat app>
            <BackButton />
            <v-toolbar-title style="padding-left: 3px">{{$t('Login')}}</v-toolbar-title>
        </v-app-bar>
        <v-row justify="center">
            <v-col cols="10" md="8" lg="6">
                <LoginForm :formData="{username, password, type}" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import LoginForm from '../components/LoginForm'
import BackButton from '../components/BackButton'

export default {
    components: {
        LoginForm,
        BackButton
    },
    props: ['username', 'password', 'type'],
    mounted() {
        console.log([this.username, this.password, this.type])
    }
}
</script>

<style>
</style>