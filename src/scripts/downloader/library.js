const config = require('../Config')
const path = require('path')
const { validateFile, system, checkRules } = require('./common')

const libraryPath = path.join(config.gameRoot, 'libraries')

function validateDependence(dependence) {
    const filePath = path.join(libraryPath, ...dependence.path.split('/'))
    return validateFile(filePath, dependence.sha1)
}

function validateArtifact(library) {
    return validateDependence(library.downloads.artifact)
}

function validateClassifier(library, native) {
    const classifier = library.classifiers[native]
    const filePath = path.join(config.gameRoot, ...classifier.path.split('/'))
    return validateDependence(filePath, classifier.sha1)
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
            if (downloads.classifier) {
                const native = library.native[system]
                if (validateClassifier(library, native)) {
                    missingDependencies.push(downloads.classifier[native])
                }
            }
        }
    });
    return missingDependencies.filter((item, index, array) => array.indexOf(item, 0) === index);
}

module.exports = {
    validateAllDependencies
}

async function main() {
    const library = require('./library.json')
    console.log(await validateAllDependencies(library.libraries))

}

main()