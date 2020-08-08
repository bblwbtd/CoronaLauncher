const { validateClient, downloadClient } = require('../src/scripts/downloader/client')
const versionDetail = require('./1.16.json')

function testValidateAndDownload() {
    const exist = validateClient(versionDetail)
    console.log(exist)
    if (!exist) {
        downloadClient(versionDetail)
    }
}

testValidateAndDownload()

