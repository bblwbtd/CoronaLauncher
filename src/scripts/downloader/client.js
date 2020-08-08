const { download, validateFile } = require('./common')
const path = require('path')
const { getConfig } = require('../config')

function getClientPath(id) {
    const { gameRoot } = getConfig()
    return path.join(gameRoot, 'versions', id, `${id}.jar`)
}

function downloadClient(versionDetail, requestConfig) {
    const { id } = versionDetail
    const { client } = versionDetail.downloads
    const clientPath = getClientPath(id)
    return download(client.url, clientPath, client.sha1, requestConfig)
}

function validateClient(versionDetail) {
    const { id } = versionDetail
    const { client } = versionDetail.downloads
    const clientPath = getClientPath(id)
    return validateFile(clientPath, client.sha1)
}

module.exports = {
    downloadClient,
    validateClient
}