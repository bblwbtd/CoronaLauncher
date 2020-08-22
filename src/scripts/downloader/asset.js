const { validateFile, patchDownload, download, getMirror, replaceHost } = require('../common')
const path = require('path')
const { getConfig } = require('../config')
const fs = require('fs')

function downloadAssetIndex(versionDetail) {
    const { assetIndex } = versionDetail
    const filePath = getAssetIndexFilePath(assetIndex)
    const mirror = getMirror()
    return download(
        replaceHost(assetIndex.url, mirror.assetIndex),
        filePath,
        assetIndex.sha1,
    )
}

function validateAssetIndex(versionDetail) {
    const { assetIndex } = versionDetail
    const filePath = getAssetIndexFilePath(assetIndex)
    const hash = assetIndex.sha1
    return validateFile(filePath, hash)
}

function transformAssetObjects2Task(assetObjects = [], requestConfig) {
    const tasks = []
    const { asset } = getMirror()
    for (const assetInfo of assetObjects) {
        const filePath = getAssetFilePath(assetInfo)
        const sha1 = assetInfo.hash
        const URL = `https://${asset}/${sha1.substr(0, 2)}/${sha1}`
        const size = assetInfo.size
        tasks.push({
            sha1,
            URL,
            filePath,
            size,
            requestConfig
        })
    }
    return tasks
}

function downloadAsset(assetObjects = [], requestConfig, downloadConfig) {
    const tasks = transformAssetObjects2Task(assetObjects, requestConfig)
    return patchDownload(tasks, downloadConfig)
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
    const temp = fs.readFileSync(getAssetIndexFilePath(assetIndex)).toString()
    const { objects } = JSON.parse(temp) ;
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
    validateAllAsset,
    transformAssetObjects2Task
}