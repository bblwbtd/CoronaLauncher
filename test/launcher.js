// const { launch, validateResources } = require('../src/scripts/launcher')
// const { extractAllNativesLibrary, validateAllDependencies, downloadDependence } = require('../src/scripts/downloader/library')
// const { validateAllAsset, downloadAsset } = require('../src/scripts/downloader/asset.js')
// const { fetchVersionManifest, findVersion, fetchVersionDetail } = require('../src/scripts/downloader/version')


// async function main() {
//     const versionManifest = await fetchVersionManifest()
//     const version = findVersion(versionManifest, '1.16.1')
//     const versionDetail = await fetchVersionDetail(version.url)
//     // const missingDependencies = validateAllDependencies(versionDetail)
//     // await downloadDependence(missingDependencies)
//     // const missingAssets = validateAllAsset(versionDetail)
//     // await downloadAsset(missingAssets)
//     // extractAllNativesLibrary(versionDetail)
//     // launch(versionDetail)
//     const tasks = await validateResources(versionDetail, '1.16')
//     console.log(tasks)
// }

// main()


// exec('java -jar', (err, stdout, stderr) => {
//     console.log(stdout)
// })