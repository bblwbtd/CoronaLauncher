/**
 * @jest-environment node
 */
const {
    downloadAsset,
    downloadAssetIndex,
    validateAssetIndex,
    validateAllAsset
} = require('../src/scripts/downloader/asset')
const versionDetail = require('./1.16.json')
// const path = require('path')
// const { getConfig } = require('../src/scripts/config')
// const fs = require('fs')

async function testValidateAndDownloadAsset() {
    const result = await validateAssetIndex(versionDetail)
    if (!result) {
        await downloadAssetIndex(versionDetail)
    }
    const missingAsset = validateAllAsset(versionDetail)
    console.log(missingAsset)
    const response = downloadAsset(missingAsset)
    console.log(response)
}

testValidateAndDownloadAsset()

// it('testDownloadAssetIndex', async () => {
//     await downloadAssetIndex(versionDetail)
//     const result = await validateAssetIndex(versionDetail)
//     expect(result).toBeTruthy()
// }, 60000)
