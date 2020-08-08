const path = require('path')
const { 
    validateFile, 
    system, 
    checkRules, 
    patchDownload,
    ensureDirExist
} = require('./common')
const { getConfig } = require('../config')
const StreamZip = require('node-stream-zip')
const fs = require('fs')

function getLibrariesPath() {
    const { gameRoot } = getConfig()
    return path.join(gameRoot, 'libraries')
}

function validateDependence(dependence) {
    const filePath = path.join(getLibrariesPath(), ...dependence.path.split('/'))
    const result = validateFile(filePath, dependence.sha1)
    return result
}

function validateArtifact(library) {
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

function validateAllDependencies(versionDetail) {
    const { libraries } = versionDetail
    const missingDependencies = []
    libraries.forEach(library => {
        const downloads = library.downloads
        if (isVitalDependence(library)) {
            if (!validateArtifact(library)) {
                missingDependencies.push(downloads.artifact)
            }
            if (downloads.classifiers) {
                const native = library.natives[system]
                if (!validateClassifier(library, native)) {
                    missingDependencies.push(downloads.classifiers[native])
                }
            }
        }
    });
    return missingDependencies.filter((item, index, array) => array.indexOf(item, 0) === index);
}

function downloadDependence(libraries, requestConfig) {
    const tasks = []
    for (const library of libraries) {
        tasks.push({
            URL: library.url,
            filePath: path.join(getLibrariesPath(), ...library.path.split('/')),
            sha1: library.sha1,
            requestConfig
        })
    }
    return patchDownload(tasks)
}

function extractNativeLibrary(zipFile, outDir) {
    const libraryExtensionMap = {
        'osx': '.dylib',
        'linux': '.so',
        'windows': '.dll'
    }
    const extension = libraryExtensionMap[system]
    const re = new RegExp(`[\\S]*${extension}`)
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipFile,
            storeEntries: true
        })

        zip.on('error', (e) => reject(e))
        
        zip.on('ready', () => {
            const target = Object.keys(zip.entries()).find(v => re.test(v))
            if (target) {
                const outPath = path.join(outDir, target)
                ensureDirExist(outDir)
                const writer = fs.createWriteStream(outPath)
                zip.stream(target, (err, stream) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    stream.pipe(writer)
                    stream.on('end', () => {
                        zip.close()
                        resolve()
                    })
                    stream.on('error', (e) => {
                        reject(e)
                    } )
                })
            } else {
                reject(new Error('Can not find the library!'))
            }
        })
    })
}

async function extractAllNativesLibrary(versionDetail) {
    const { libraries } = versionDetail;
    const { id } = versionDetail
    const outPath = path.join(getConfig().gameRoot, 'versions', id, `${id}-natives`)
    for (const library of libraries) {
        const { downloads } = library
        if (isVitalDependence(library) && downloads.classifiers) {
            const native = library.natives[system]
            const classifier = downloads.classifiers[native]
            const classifierPath = path.join(getLibrariesPath(), classifier.path)
            await extractNativeLibrary(classifierPath, outPath)
            console.log(classifierPath)
        }
    }
}

module.exports = {
    validateAllDependencies,
    downloadDependence,
    extractAllNativesLibrary
}