const { getConfig } = require('../config')
const path = require('path')
const fs = require('fs')
const got = require('got')
const { ensureDirExist, getMirror, replaceHost } = require('../common')

async function fetchVersionManifest() {
    const { mirrors, currentMirror } = getConfig()
    const { versionManifest } = mirrors[currentMirror]
    const { body } = await got('https://' + versionManifest, { responseType: 'json' })
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

function writeVersionDetail(rawVersionDetail) {
    const { gameRoot } = getConfig()
    const { id } = JSON.parse(rawVersionDetail)
    const filePath = path.join(gameRoot, 'versions', id, `${id}.json`)
    ensureDirExist(path.join(gameRoot, 'versions', id))
    fs.writeFileSync(filePath, rawVersionDetail)
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
}