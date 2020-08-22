/**
 * @jest-environment node
 */
const { validateAllDependencies, downloadDependence, extractAllNativesLibrary } = require('../src/scripts/downloader/library')
const versionDetail = require('./1.16.json')
async function testValidateAllDependencies() {
    const missing = validateAllDependencies(versionDetail)
    console.log(missing)
}

function testDownloadDependencies() {
    const missing = validateAllDependencies(versionDetail)
    console.log(missing)
    const cancel = downloadDependence(missing, {},{
        onProgress: (data) => {
            const { downloadingTasks, remainingTasks, success, failed } = data
            console.log(success.length / (downloadingTasks.length + remainingTasks.length + success.length + failed.length))
        }
    })
    setTimeout(() => {
        cancel()
    }, 1000)

}

function testExtractAllNativesLibrary() {
    extractAllNativesLibrary(versionDetail)
}

testValidateAllDependencies()
testDownloadDependencies()
testExtractAllNativesLibrary()