import Vue from 'vue'
import Vuex from 'vuex'
const { getConfig, applyAndWriteConfig } = require('../scripts/config')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tab: 0,
    config: getConfig()
  },
  mutations: {
    setTab(state, tab) {
      state.tab = tab
    },
    setConfig(state, config) {
      state.config = config,
      applyAndWriteConfig(config)
    },
  },
  actions: {
   
  },
  modules: {
  }
})
