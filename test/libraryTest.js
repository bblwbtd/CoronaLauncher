const { validateAllDependencies, downloadDependence } = require('../src/scripts/downloader/library')
const versionDetail = require('./1.16.json')
async function testValidateAllDependencies() {
    const missing = validateAllDependencies(versionDetail.libraries)
    console.log(missing)
}

async function testDownloadDependencies() {
    const missing = validateAllDependencies(versionDetail.libraries)
    console.log(missing)
    const result = await downloadDependence(missing)
    console.log(result[1])
}

testValidateAllDependencies()
testDownloadDependencies()