/**
 * @jest-environment node
 */
const { validateAllDependencies, downloadDependence, extractAllNativesLibrary } = require('../src/scripts/downloader/library')
const versionDetail = require('./1.16.json')
async function testValidateAllDependencies() {
    const missing = await validateAllDependencies(versionDetail)
    console.log(missing)
}

async function testDownloadDependencies() {
    const missing = await validateAllDependencies(versionDetail)
    console.log(missing)
    downloadDependence(missing, {},{
        onProgress: (data) => {
            console.log(data)
        }
    })
}

function testExtractAllNativesLibrary() {
    extractAllNativesLibrary(versionDetail)
}

testValidateAllDependencies()
testDownloadDependencies()
testExtractAllNativesLibrary()