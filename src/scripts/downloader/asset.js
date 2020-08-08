const { validateFile, patchDownload, download } = require('./common')
const path = require('path')
const { getConfig } = require('../config')

function getMirror() {
    const { mirrors, currentMirror } = getConfig()
    return mirrors[currentMirror]
}

function downloadAssetIndex(versionDetail, requestConfig = {}) {
    const { assetIndex } = versionDetail
    const filePath = getAssetIndexFilePath(assetIndex)
    return download(
        assetIndex.url,
        filePath,
        assetIndex.sha1,
        requestConfig
    )
}

function validateAssetIndex(versionDetail) {
    const { assetIndex } = versionDetail
    const filePath = getAssetIndexFilePath(assetIndex)
    const hash = assetIndex.sha1
    return validateFile(filePath, hash)
}

function downloadAsset(assetObjects = [], requestConfig) {
    const tasks = []
    const { asset } = getMirror()
    for (const assertInfo of assetObjects) {
        const filePath = getAssetFilePath(assertInfo)
        const sha1 = assertInfo.hash
        const URL = `${asset}/${sha1.substr(0, 2)}/${sha1}`
        tasks.push({
            sha1,
            URL,
            filePath,
            requestConfig
        })
    }
    return patchDownload(tasks)
}

function validateAsset(assetObj) {
    const filePath = getAssetFilePath(assetObj)
    return validateFile(filePath, assetObj.hash)
}

function getAssetFilePath(assetObj) {
    const hash = assetObj.hash
    const filePath = path.join(getConfig().gameRoot, 'assets', 'objects', `${hash.substr(0, 2)}/${hash}`)
    return filePath
}

function getAssetIndexFilePath(assetIndexInfo) {
    return path.join(getConfig().gameRoot, 'assets', 'indexes', `${assetIndexInfo.id}.json`)
}

function validateAllAsset(versionDetail) {
    const { assetIndex } = versionDetail
    const { objects } = require(getAssetIndexFilePath(assetIndex))
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