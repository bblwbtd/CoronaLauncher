
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'cn',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  configureWebpack: {
    
  }
}
