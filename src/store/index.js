import Vue from 'vue'
import Vuex from 'vuex'
import { readAllVersions } from '../scripts/versions'
import { getConfig, applyAndWriteConfig } from '../scripts/config'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tab: 0,
    config: getConfig(),
    versions: [],
    missions: [],
    accountState: 'unknown'
  },
  mutations: {
    setTab(state, tab) {
      state.tab = tab
    },
    setAccountState(state, accountState){
      state.accountState = accountState
    },
    setConfig(state, config) {
      state.config = config,
      applyAndWriteConfig(config)
    },
    setVersions(state, versions) {
      state.versions = versions
    },
    addDownloadMission(state, mission) {
      state.missions.push(mission)
    },
    removeDownloadMission(state, missionID) {
      state.missions = state.missions.filter(mission => mission.id !== missionID)
    },
    updateDownloadMissionState(state, { missionID, missionState }) {
      for (let i = 0; i < state.missions.length; i += 1) {
        const mission = state.missions[i];
        if (missionID === mission.id) {
          mission.state = missionState
          state.missions = [...state.missions]
          break
        }
      }
    },
    updateDownloadMission(state, mission) {
      for (let index = 0; index < state.missions.length; index += 1) {
        const target = state.missions[index];
        if (target.id === mission.id) {
          state.missions[index] = {...target, ...mission}
          state.missions = [...state.missions]
          return
        }
      }
    }
  },
  actions: {
    refreshVersions({ commit }) {
      readAllVersions().then(versions => commit('setVersions', versions.reverse()))
    },
    refreshConfig({ commit }){
      commit('setConfig', getConfig())
    }
  },
  modules: {
  }
})
