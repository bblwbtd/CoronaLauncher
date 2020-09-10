<template>
  <v-app>
    <Drawer />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import { getConfig } from './scripts/config'
import { officialValidateToken, officialRefresh, officialLogin } from './scripts/login'
import { updateVersionManifest } from './scripts/downloader/version'

export default {
  name: 'Home',
  components: {
    Drawer
  },
  data: () => ({
    config: {}
  }),
  methods: {
    async checkAccount() {
      const config = this.$store.state.config
      const account = config.currentAccount
    
      if (account.type === 'Mojang') {
        try {
          await officialValidateToken()
          const response = await officialRefresh(account.accessToken)
          const { data } = response
          account.profile = data.selectedProfile
          account.accessToken = data.accessToken
          this.$store.commit('setConfig', config)
        } catch(e) {
          try{
            await officialLogin(account.username, account.password)
          } catch(e) {
            this.$store.commit('setAccountState', 'loginFailed')
            return
          }
        }
        console.log(this.$store.state.accountState)
        this.$store.commit('setAccountState', 'valid')
        console.log(this.$store.state.accountState)
      }
    }
  },
  mounted() {
    this.$i18n.locale = getConfig().language
    this.$store.dispatch('refreshVersions')
    this.checkAccount()
    updateVersionManifest()
  }
}
</script>

<style>
@import 'global.css';

#content {
  height: 100vh;
}

</style>
