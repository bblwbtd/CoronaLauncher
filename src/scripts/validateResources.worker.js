const {
    validateAllAsset,
    validateAssetIndex,
    downloadAssetIndex,
    transformAssetObjects2Task
} = require("./downloader/asset.js");
const {
    validateClient,
    getClientDownloadTask
} = require("./downloader/client");
const { validateLogConfig, getLogDownloadTask } = require("./downloader/log");
const {
    validateAllDependencies,
    transformLibraries2Tasks
} = require("./downloader/library");
const { copyClient } = require("./client");
const os = require('os')

const validateResources = async (versionDetail, name) => {
    if (os !== 'linux') {
        if (!(await validateAssetIndex(versionDetail))) {
            const [promise] = downloadAssetIndex(versionDetail);
            await promise;
        }
    }

    const assetDownloadTasks = transformAssetObjects2Task(
        await validateAllAsset(versionDetail)
    );

    const libraryDownloadTasks = transformLibraries2Tasks(
        await validateAllDependencies(versionDetail)
    );

    const tasks = [...assetDownloadTasks, ...libraryDownloadTasks];

    const hasClient = await validateClient(versionDetail);

    if (!hasClient) {
        tasks.push(getClientDownloadTask(versionDetail));
    } else if (hasClient && versionDetail.id !== name) {
        copyClient(versionDetail.id, name);
    }

    const hasLogConfig = await validateLogConfig(versionDetail);

    if (!hasLogConfig) {
        tasks.push(getLogDownloadTask(versionDetail));
    }

    return tasks;
};

onmessage = async (e) => {
    const { versionDetail, name } = e.data
    const tasks = await validateResources(versionDetail, name)
    postMessage(tasks)
}