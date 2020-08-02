const {getAxios, validateFile, download} = require('./common')
const config = require('../Config')
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

async function main() {
    const fs = require('fs');
    const assetIndexInfo = {
        "id": "1.16",
        "sha1": "45aed441ccac08821cfc1121712e2a5b0df252e9",
        "size": 295414,
        "totalSize": 328850850,
        "url": "https://launchermeta.mojang.com/v1/packages/45aed441ccac08821cfc1121712e2a5b0df252e9/1.16.json"
    }
    const indexPath = await downloadAssetIndex(assetIndexInfo)
    const result = await validateAssetIndex(assetIndexInfo)
    console.log(result)
    const missing = await validateAllAssert(assetIndexInfo)
    const downloaded = await Promise.allSettled(missing.map(element => downloadAsset(element)))
    console.log(downloaded)
}

main()