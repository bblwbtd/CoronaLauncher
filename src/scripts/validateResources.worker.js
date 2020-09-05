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
// const { expose } = require("threads/worker");

const validateResources = async (versionDetail, name) => {
    if (!(await validateAssetIndex(versionDetail))) {
        const [promise] = downloadAssetIndex(versionDetail);
        await promise;
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

// expose({
//     validateResources,
// })

// process.on('message', async (message) => {
//     const {versionDetail, name} = message
//     process.send(await validateResources(versionDetail, name))
// })

onmessage = async (e) => {
    const { versionDetail, name } = e.data
    const tasks = await validateResources(versionDetail, name)
    postMessage(tasks)
}

// addEventListener('message', async e => {
//     const { versionDetail, name } = e.data
//     const tasks = await validateResources(versionDetail, name)
//     postMessage(tasks)
// })

// const {
//     Worker,
//     isMainThread,
//     parentPort,
//     workerData
// } = require("worker_threads");

// if (isMainThread) {
//     module.exports = (versionDetail, name) => {
//         return new Promise((resolve, reject) => {
//             const worker = new Worker( __filename, {
//                 workerData: { versionDetail, name }
//             });
//             worker.on("message", resolve);
//             worker.on("error", reject);
//             worker.on("exit", code => {
//                 if (code !== 0)
//                     reject(new Error(`工作线程使用退出码 ${code} 停止`));
//             });
//         });
//     };
// } else {
//     const { versionDetail, name } = workerData;
//     validateResources(versionDetail, name).then(tasks => {
//         parentPort.postMessage(tasks);
//     });
// }


// module.exports = validateResources