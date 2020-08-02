const axios = require('./common').axios
const config = require('../Config')

function fetchVersionList(){
    return axios.get(config.versionListURL)
}

function fetchVersionDetail(versionURL){
    return axios.get(versionURL)
}

function findVersion(versions, id) {
    return versions.find(version => version.id === id)
}

function getLatestRelease(rawVersions) {
    const latest = rawVersions.latest
    return findVersion(rawVersions.versions ,latest.release)
}

