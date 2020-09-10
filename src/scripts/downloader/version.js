const { getConfig, getCacheDir } = require('../config')
const path = require('path')
const fs = require('fs')
const got = require('got')
const { getMirror, replaceHost } = require('../common')
const { ensureDirExist } = require('../utils')

const versionManifestPath = path.join(getCacheDir(), 'versionManifest.json')

async function fetchVersionManifest() {
    if (fs.existsSync(versionManifestPath)) {
        console.log('hit')
        return JSON.parse(fs.readFileSync(versionManifestPath))
    }
    console.log('miss')
    return await updateVersionManifest()
}

async function updateVersionManifest() {
    const { mirrors, currentMirror } = getConfig()
    const { versionManifest } = mirrors[currentMirror]
    const { body } = await got('https://' + versionManifest, { responseType: 'json' })
    ensureDirExist(getCacheDir())
    fs.writeFileSync(versionManifestPath, JSON.stringify(body))
    return body
}

async function fetchVersionDetail(versionURL) {
    const mirror = getMirror()
    const { body } = await got(replaceHost(versionURL, mirror.assetIndex), { responseType: 'json' })
    return body
}

function findVersion(versionManifest, id) {
    const { versions } = versionManifest
    return versions.find(version => version.id === id)
}

function writeVersionDetail(versionDetail) {
    const { gameRoot } = getConfig()
    const { id } = versionDetail
    const filePath = path.join(gameRoot, 'versions', id, `${id}.json`)
    ensureDirExist(path.join(gameRoot, 'versions', id))
    fs.writeFileSync(filePath, JSON.stringify(versionDetail))
}

function getLatestRelease(versionManifest) {
    const latest = versionManifest.latest
    return findVersion(versionManifest, latest.release)
}

module.exports = {
    fetchVersionDetail,
    fetchVersionManifest,
    writeVersionDetail,
    getLatestRelease,
    findVersion,
    updateVersionManifest
}