const { getConfig } = require('./config')
const fs = require('fs')
const path = require('path')
const { ensureDirExist } = require('./utils')
const { fetchVersionManifest, getLatestRelease, fetchVersionDetail, writeVersionDetail } = require('./downloader/version')

const versionsDirPath = path.join(getConfig().gameRoot, 'versions')

// Download version detail into versions directory without resources
async function installNewVersion(id) {
    const manifest = await fetchVersionManifest()
    const versionMeta = manifest.versions.find(
        version => version.id === id
    );
    const versionDetail = await fetchVersionDetail(versionMeta.url);
    await writeVersionDetail(versionDetail);
    return versionDetail
}

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
            const baseVersion = JSON.parse(fs.readFileSync(detailPath))
            versions.push({
                name: file,
                dirPath: versionDirPath,
                detailFilePath: detailPath,
                baseVersion,
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
        if (!versions.length) {
            versions.push({
                name: latest.id,
                dirPath: versionDirPath,
                detailFilePath: versionDetailFile
            })
        }
    } catch(err) {
        console.log(err)
    }
    console.log(versions)
    return versions
} 

function removeVersion(version) {
    const versionDirPath = path.join(versionsDirPath, version)
    fs.rmdirSync(versionDirPath, { recursive: true })
}

function renameVersion(oldName, newName) {
    const oldDirPath = path.join(versionsDirPath, oldName)
    const newDirPath = path.join(versionsDirPath, newName)
    fs.renameSync(oldDirPath, newDirPath)
}

module.exports = {
    readAllVersions,
    removeVersion,
    renameVersion,
    installNewVersion
}

