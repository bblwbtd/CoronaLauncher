const path = require('path')
const { 
    validateFile, 
    system, 
    checkRules, 
    patchDownload,
    getMirror,
    replaceHost
} = require('../common')
const { getConfig } = require('../config')
const StreamZip = require('node-stream-zip')
const fs = require('fs')
const { ensureDirExist } = require('../utils')

function getLibrariesPath() {
    const { gameRoot } = getConfig()
    return path.join(gameRoot, 'libraries')
}

async function validateDependence(dependence) {
    const filePath = path.join(getLibrariesPath(), ...dependence.path.split('/'))
    const result = await validateFile(filePath, dependence.sha1)
    return result
}

function validateArtifact(library) {
    if (!library.downloads.artifact) return true
    return validateDependence(library.downloads.artifact)
}

function validateClassifier(library, native) {
    const classifier = library.downloads.classifiers[native]
    if (!classifier) return true
    return validateDependence(classifier)
}

function isVitalDependence(library) {
    const rules = library.rules;
    if (library.natives) {
        const result = Object.keys(library.natives).includes(system)
        return result
    }
    return checkRules(rules)
}

async function validateAllDependencies(versionDetail) {
    const { libraries } = versionDetail
    const missingDependencies = []

    for (let index = 0; index < libraries.length; index++) {
        const library = libraries[index];
        const downloads = library.downloads
        if (isVitalDependence(library)) {
            if (!await validateArtifact(library)) {
                missingDependencies.push(downloads.artifact)
            }
            if (downloads.classifiers) {
                const native = library.natives[system]
                if (!await validateClassifier(library, native)) {
                    missingDependencies.push(downloads.classifiers[native])
                }
            }
        }
    }
    
    return missingDependencies.filter((item, index, array) => array.indexOf(item, 0) === index);
}

function transformLibraries2Tasks(libraries, requestConfig) {
    const tasks = []
    const mirror = getMirror()
    for (const library of libraries) {
        tasks.push({
            URL: replaceHost(library.url, mirror.libraries) ,
            filePath: path.join(getLibrariesPath(), ...library.path.split('/')),
            sha1: library.sha1,
            size: library.size,
            requestConfig
        })
    }
    return tasks
}

function downloadDependence(libraries, requestConfig, downloadConfig) {
    const tasks = transformLibraries2Tasks(libraries, requestConfig)
    return patchDownload(tasks, downloadConfig)
}

function extractNativeLibrary(zipFile, outDir) {

    return new Promise((res, rej) => {
        const libraryExtensionMap = {
            'osx': '(.dylib|.jnilib)$',
            'linux': '(.so)$',
            'windows': '(.dll)$'
        }
        const extension = libraryExtensionMap[system]
        const re = new RegExp(extension)
        const zip = new StreamZip({
            file: zipFile,
            storeEntries: true
        })
    
        zip.on('error', (e) => {throw new Error(e)})
        
        zip.on('ready', () => {
            const promises = []

            Object.keys(zip.entries()).forEach(v => {
                if (!re.test(v)) return
                const outPath = path.join(outDir, v)
                promises.push(new Promise((resolve, reject) => {
                    ensureDirExist(outDir)
                    const writer = fs.createWriteStream(outPath)
                    zip.stream(v, (err, stream) => {
                        if (err) {
                            console.log(v)
                            reject(new Error(err))
                            return
                        }
                        stream.pipe(writer)
                        stream.on('end', () => {
                            // zip.close()
                            resolve()
                        })
                        stream.on('error', (e) => {
                            reject(new Error(e))
                        } )
                    })
                }))
            })
            
            Promise.all(promises).then(() => {
                res()
            }).catch((e) => {
                rej(new Error(e))
            })
        })

    })
}

function getDefaultNativeDir() {
    return path.join(getConfig().gameRoot, 'bin')
}

async function extractAllNativesLibrary(
    versionDetail, 
    outDir = getDefaultNativeDir()
) {
    const { libraries } = versionDetail;
    ensureDirExist(outDir)
    
    for (const library of libraries) {
        const { downloads } = library
        if (isVitalDependence(library) && downloads.classifiers) {
            const native = library.natives[system]
            const classifier = downloads.classifiers[native]
            const classifierPath = path.join(getLibrariesPath(), classifier.path)
            await extractNativeLibrary(classifierPath, outDir)
        }
    }
}

module.exports = {
    validateAllDependencies,
    downloadDependence,
    extractAllNativesLibrary,
    isVitalDependence,
    transformLibraries2Tasks
}