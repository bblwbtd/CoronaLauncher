const axios = require('./common').getAxios()
const { getConfig } = require('../config')
const path = require('path')
const fs = require('fs')

async function fetchVersionManifest(){
    const { mirrors, currentMirror } = getConfig()
    const { versionManifest } = mirrors[currentMirror]
    const response = await axios.get(versionManifest)
    return response.data
}

async function fetchVersionDetail(versionURL){
    const response = await axios.get(versionURL)
    return response.data
}

function findVersion(versionManifest, id) {
    const { versions } = versionManifest
    return versions.find(version => version.id === id)
}

function writeVersionDetail(rawVersionDetail) {
    const { gameRoot } = getConfig()
    const { id } = JSON.stringify(rawVersionDetail)
    const filePath = path.join(gameRoot, 'versions', id, `${id}.json`)
    fs.writeFileSync(filePath, rawVersionDetail)
}

function getLatestRelease(versionManifest) {
    const latest = versionManifest.latest
    return findVersion(versionManifest ,latest.release)
}

module.exports = {
    fetchVersionDetail,
    fetchVersionManifest,
    writeVersionDetail,
    getLatestRelease,
    findVersion,
}