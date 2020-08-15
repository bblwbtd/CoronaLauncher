<template>
  <v-container fluid class="fill-height align-center justify-center">
      <v-app-bar flat app>
          <v-btn icon @click="() => $router.go(-1)">
              <v-icon>
                  mdi-arrow-left
              </v-icon>
          </v-btn>
          <v-toolbar-title style="padding-left: 3px">
            {{$t('Login')}}
          </v-toolbar-title>
      </v-app-bar>
      <LoginForm />
  </v-container>
</template>

<script>
import LoginForm from '../components/LoginForm'
export default {
    components: {
        LoginForm
    }
}
</script>

<style>

</style>