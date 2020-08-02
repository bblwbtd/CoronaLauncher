const config = require('../config')
const path = require('path')
const { validateFile, system, checkRules, patchDownload } = require('./common')

const libraryPath = path.join(config.gameRoot, 'libraries')

function validateDependence(dependence) {
    const filePath = path.join(libraryPath, ...dependence.path.split('/'))
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
        if (Object.values(library.natives).includes(system)) {
            return true
        } else if (Object.values(library.natives).includes(system)){
            return true
        }
    }
    return checkRules(rules)
}

function validateAllDependencies(libraries) {
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

function downloadDependence(libraries) {
    const tasks = []
    for (const library of libraries) {
        tasks.push({
            URL: library.url,
            filePath: path.join(libraryPath, ...library.path.split('/')),
            sha1: library.sha1
        })
    }
    return patchDownload(tasks)
}

module.exports = {
    validateAllDependencies,
    downloadDependence
}