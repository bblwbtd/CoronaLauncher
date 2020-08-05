const {
    downloadAsset,
    downloadAssetIndex,
    validateAssetIndex,
    validateAllAsset
} = require('../src/scripts/downloader/asset')
const { assetIndex } = require('./1.16.json')

async function testValidateAndDownloadAsset() {
    const result = await validateAssetIndex(assetIndex)
    console.log(result)
    if (!result) {
        await downloadAssetIndex(assetIndex)
    }
    const missingAsset = validateAllAsset(assetIndex)
    console.log(missingAsset)
    await downloadAsset(missingAsset)
}

testValidateAndDownloadAsset()