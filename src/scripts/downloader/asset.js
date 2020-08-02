const {getAxios, validateFile, download} = require('./common')
const config = require('../config')
const path = require('path')

const axios = getAxios()

const mirror = config.mirrors[config.currentMirror]

async function downloadAssetIndex(assetIndexInfo, requestConfig = {}) {
    const filePath = getAssetIndexFilePath(assetIndexInfo)
    return download(assetIndexInfo.url, filePath, requestConfig)
}   

async function validateAssetIndex(assetIndexInfo) {
    const filePath = getAssetIndexFilePath(assetIndexInfo)
    const hash = assetIndexInfo.sha1
    return validateFile(filePath, hash)
}

async function downloadAsset(assetObj, requestConfig = {}) {
    const filePath = getAssetFilePath(assetObj)
    const hash = assetObj.hash
    const URL = `${mirror.asset}/${hash.substr(0,2)}/${hash}`
    return download(URL, filePath, requestConfig)
}

async function validateAssert(assetObj) {
    const filePath = getAssetFilePath(assetObj)
    return validateFile(filePath, assetObj.hash)
}

function getAssetFilePath(assetObj) {
    const hash = assetObj.hash
    const filePath = path.join(config.gameRoot, 'assets', 'objects', `${hash.substr(0,2)}/${hash}`)
    return filePath
}

function getAssetIndexFilePath(assetIndexInfo) {
    return path.join(config.gameRoot, 'assets', 'indexes', `${assetIndexInfo.id}.json`)
}

async function validateAllAssert(assetIndexInfo) {
    const response = await axios.get(assetIndexInfo.url)
    const assetIndex = response.data
    const allObjects = assetIndex.objects
    const missingFile = []
    for (let value of Object.values(allObjects)) {
        if (!await validateAssert(value)) {
            missingFile.push(value)
        }
    }
    return missingFile
}

module.exports = {
    downloadAsset,
    downloadAssetIndex,
    validateAssetIndex,
    validateAllAssert
}