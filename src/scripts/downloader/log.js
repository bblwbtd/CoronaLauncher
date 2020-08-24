const { download, validateFile, getMirror, replaceHost } = require('../common')
const path = require('path')
const { getConfig } = require('../config')

function getLogConfigPath(id) {
    const { gameRoot } = getConfig()
    const logConfigDirPath = path.join(gameRoot, 'assets', 'log_configs')
    return path.join(logConfigDirPath, id)
}

function validateLogConfig(versionDetail){
    const { file } = versionDetail.logging.client
    return validateFile(getLogConfigPath(file.id), file.sha1)
}

function downloadLogConfig(versionDetail) {
    const { id, sha1, url } = versionDetail.logging.client.file
    const { gameRoot } = getConfig()
    const logConfigDirPath = path.join(gameRoot, 'assets', 'log_configs')
    const filePath = path.join(logConfigDirPath, id)
    const mirror = getMirror()
    return download(replaceHost(url, mirror.client), filePath, sha1)
}

function getLogDownloadTask(versionDetail) {
    const { id, sha1, url, size } = versionDetail.logging.client.file
    const { gameRoot } = getConfig()
    const logConfigDirPath = path.join(gameRoot, 'assets', 'log_configs')
    const filePath = path.join(logConfigDirPath, id)
    const mirror = getMirror()
    return {
        sha1,
        URL: replaceHost(url, mirror.client),
        filePath,
        size,
    }
}

module.exports = {
    downloadLogConfig,
    validateLogConfig,
    getLogDownloadTask,
}