const { getConfig } = require('./config')
const fs = require('fs')
const path = require('path')
const { validateFile, ensureDirExist } = require('./common')

const versionsDirPath = path.join(getConfig().gameRoot, 'versions')

async function readAllVersions() {
    ensureDirExist(versionsDirPath)
    const files = fs.readdirSync(versionsDirPath)
    const versions = []
    files.forEach(file => {
        const versionDirPath = path.join(versionsDirPath, file)
        const stat = fs.statSync(versionDirPath)
        if (!stat.isDirectory()) return
        
        const innerFiles = fs.readdirSync(versionDirPath)
        const versionDetailFile = innerFiles.find(file => /.(json)$/.test(file))
        const jarFile = innerFiles.find(f => f === `${file}.jar`)
        if (versionDetailFile && jarFile) {
            const detailPath = path.join(versionDirPath, versionDetailFile)
            const jarPath = path.join(versionDirPath, jarFile)
            const content = fs.readFileSync(detailPath).toString()
            try{
                const versionDetail = JSON.parse(content)
                const { downloads } = versionDetail
                const { client } = downloads
                if (!validateFile(jarPath, client.sha1)) {
                    return
                }
            } catch(e) {
                return
            }
            versions.push({
                name: file,
                dirPath: versionDirPath,
                detailFilePath: detailPath
            })
        }
    })
    return versions
} 

function removeVersion(version) {
    const versionDirPath = path.join(versionsDirPath, version)
    fs.rmdirSync(versionDirPath, { recursive: true })
}

module.exports = {
    readAllVersions,
    removeVersion
}

