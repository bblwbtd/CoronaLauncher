const { validateFile, patchDownload, download } = require('./common')
const config = require('../config')
const path = require('path')

const mirror = config.mirrors[config.currentMirror]

async function downloadAssetIndex(assetIndexInfo, requestConfig = {}) {
    const filePath = getAssetIndexFilePath(assetIndexInfo)
    return download(
        assetIndexInfo.url,
        filePath,
        assetIndexInfo.sha1,
        requestConfig
    )
}

function validateAssetIndex(assetIndexInfo) {
    const filePath = getAssetIndexFilePath(assetIndexInfo)
    const hash = assetIndexInfo.sha1
    return validateFile(filePath, hash)
}

async function downloadAsset(assetObjects = []) {
    const tasks = []
    for (const assertInfo of assetObjects) {
        const filePath = getAssetFilePath(assertInfo)
        const sha1 = assertInfo.hash
        const URL = `${mirror.asset}/${sha1.substr(0, 2)}/${sha1}`
        tasks.push({
            sha1,
            URL,
            filePath
        })
    }
    return await patchDownload(tasks)
}

function validateAsset(assetObj) {
    const filePath = getAssetFilePath(assetObj)
    return validateFile(filePath, assetObj.hash)
}

function getAssetFilePath(assetObj) {
    const hash = assetObj.hash
    const filePath = path.join(config.gameRoot, 'assets', 'objects', `${hash.substr(0, 2)}/${hash}`)
    return filePath
}

function getAssetIndexFilePath(assetIndexInfo) {
    return path.join(config.gameRoot, 'assets', 'indexes', `${assetIndexInfo.id}.json`)
}

function validateAllAsset(assetIndexInfo) {
    const { objects } = require(getAssetIndexFilePath(assetIndexInfo))
    const missingFile = []
    for (let value of Object.values(objects)) {
        if (!validateAsset(value)) {
            missingFile.push(value)
        }
    }
    return missingFile
}

module.exports = {
    downloadAsset,
    downloadAssetIndex,
    validateAssetIndex,
    validateAllAsset
}