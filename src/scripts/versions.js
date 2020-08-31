const { getConfig } = require('./config')
const fs = require('fs')
const path = require('path')
const { ensureDirExist } = require('./common')
const { fetchVersionManifest, getLatestRelease, fetchVersionDetail, writeVersionDetail } = require('./downloader/version')

const versionsDirPath = path.join(getConfig().gameRoot, 'versions')

async function readAllVersions() {
    ensureDirExist(versionsDirPath)
    const files = fs.readdirSync(versionsDirPath)
    const versions = []
    
    files.forEach(file => {
        if (file === 'Latest') {
            return
        }
        const versionDirPath = path.join(versionsDirPath, file)
        const stat = fs.statSync(versionDirPath)
        if (!stat.isDirectory()) return
        
        const innerFiles = fs.readdirSync(versionDirPath)
        const versionDetailFile = innerFiles.find(file => /.(json)$/.test(file))
        if (versionDetailFile) {
            const detailPath = path.join(versionDirPath, versionDetailFile)
            versions.push({
                name: file,
                dirPath: versionDirPath,
                detailFilePath: detailPath
            })
        }
    })

    try {
        const manifest = await fetchVersionManifest()
        const latest = getLatestRelease(manifest)
        const versionDirPath = path.join(versionsDirPath, latest.id)
        const versionDetailFile = path.join(versionDirPath, `${latest.id}.json`)
        if (
            !fs.existsSync(versionDirPath) || 
            !fs.existsSync(versionDetailFile)    
        ) {
            ensureDirExist(versionDirPath)
            const versionDetail = await fetchVersionDetail(latest.url)
            writeVersionDetail(versionDetail)
        }
        versions.push({
            name: 'Latest',
            dirPath: versionDirPath,
            detailFilePath: versionDetailFile
        })
    } catch(err) {
        console.log(err)
    }

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

