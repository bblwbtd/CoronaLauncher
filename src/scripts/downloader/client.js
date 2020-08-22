const { download, validateFile, getMirror, replaceHost } = require('../common')
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
    const mirror = getMirror()
    return download(replaceHost(client.url, mirror.client), clientPath, client.sha1, requestConfig)
}

function validateClient(versionDetail) {
    const { id } = versionDetail
    const { client } = versionDetail.downloads
    const clientPath = getClientPath(id)
    return validateFile(clientPath, client.sha1)
}

function getClientDownloadTask(versionDetail, requestConfig) {
    const { id } = versionDetail
    const { client } = versionDetail.downloads
    const clientPath = getClientPath(id)
    const mirror = getMirror()
    return {
        sha1: client.sha1,
        URL: replaceHost(client.url,mirror.client),
        filePath: clientPath,
        size: client.size,
        requestConfig
    }
}

module.exports = {
    downloadClient,
    validateClient,
    getClientDownloadTask
}