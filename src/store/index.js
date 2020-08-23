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
    downloadingMission: [],
    finishedMission: []
  },
  mutations: {
    setTab(state, tab) {
      state.tab = tab
    },
    setConfig(state, config) {
      state.config = config,
        applyAndWriteConfig(config)
    },
    setVersions(state, versions) {
      state.versions = versions
    },
    addDownloadMission(state, mission) {
      state.downloadingMission.push(mission)
    },
    addFinishedMission(state, mission) {
      state.finishedMission.push(mission)
    },
    removeDownloadMission(state, missionID) {
      state.downloadingMission = state.downloadingMission.filter(mission => mission.id !== missionID)
    },
    cancelMission(state, missionID) {
      const mission = state.downloadingMission.find(mission => mission.id === missionID)
      mission.cancel()
    },
    updateDownloadMissionState(state, { missionID, missionState }) {
      for (let i = 0; i < state.downloadingMission.length; i += 1) {
        const mission = state.downloadingMission[i];
        if (missionID === mission.id) {
          mission.state = missionState
          state.downloadingMission = [...state.downloadingMission]
          break
        }
      }
    },
    updateDownloadMission(state, mission) {
      for (let index = 0; index < state.downloadingMission.length; index += 1) {
        const target = state.downloadingMission[index];
        if (target.id === mission.id) {
          state.downloadingMission[index] = {...target, ...mission}
          state.downloadingMission = [...state.downloadingMission]
          return
        }
      }
    }
  },
  actions: {
    refreshVersions({ commit }) {
      readAllVersions().then(versions => commit('setVersions', versions.reverse()))
    },
    finishMission({ commit }, mission) {
      commit('removeDownloadMission', mission.id)
      commit('addFinishedMission', mission)
      console.log(mission)
    }
  },
  modules: {
  }
})
