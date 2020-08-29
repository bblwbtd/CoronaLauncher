const fs = require('fs')
const path = require('path')
const os = require('os')
const { getConfig } = require('./config')
const got = require('got');
const { pipeline } = require('stream')
const crypto = require('crypto')
const { v4 } = require('uuid')

const systemMap = {
    'darwin': 'osx',
    'linux': 'linux',
    'win32': 'windows'
}
const system = systemMap[os.platform()];

async function validateFile(path, hash) {
    if(fs.existsSync(path)){
        if(hash == null){
            return true
        }
        let buf = fs.readFileSync(path)
        let actualHash = crypto.createHash('sha1').update(buf).digest('hex')
        // console.log(`${actualHash} ${hash}`)
        return actualHash === hash.toLowerCase()
    }
    return false
}

function ensureDirExist(dirPath){
    fs.mkdirSync(dirPath, {recursive: true})
}

function replaceHost(URL, host) {
    const array = URL.split('/')
    array[2] = host
    return array.join('/')
}

function getMirror() {
    const { mirrors, currentMirror } = getConfig()
    return mirrors[currentMirror]
}

function patchDownload(tasks = [], downloadConfig = {}) {
    for (const task of tasks) {
        task.retries = 3
        task.transferred = 0
        task.state = 'Pending'
    }

    const { onProgress } = downloadConfig
    const cancellation = {}

    const getPendingTasks = () => {
        return tasks.filter(task => task.state === 'Pending')
    }

    const emitProgress = () => {
        if (onProgress) {
            onProgress({
                tasks,
                getSuccessfulTasks() {
                    return tasks.filter(task => task.state === 'Success')
                },
                getFailedTasks() {
                    return tasks.filter(task => task.state === 'Failed')
                },
                getDownloadingTasks() {
                    return tasks.filter(task => task.state === 'Downloading')
                },
                getPendingTasks,
            })
        }
    }

    const downloadItem = async (task) => {
        task.state = 'Downloading'
        emitProgress()
        try{
            const [promise, cancel] = download(
                task.URL, 
                task.filePath, 
                task.sha1,
                (progress) => {
                    task.transferred = progress.transferred
                    console.log(task)
                    emitProgress()
                }
            )
            cancellation[task.URL] = cancel
            await promise
            task.state = 'Success'
        } catch (error) {
            console.log(error)
            if (task.state !== 'Cancelled') {
                if (task.retries > 0) {
                    task.retries -= 1
                    task.state = 'Pending'
                } else {
                    task.state = 'Failed'
                }
            } 
        }
        emitProgress()
        delete cancellation[task.URL]
    }

    const createDownloadTask = async () => {
        while(getPendingTasks().length > 0) {
            const task = getPendingTasks().pop()
            await downloadItem(task)
        }
    }

    const startDownload = () => {
        for (let i = 0; i < getConfig().maxParallelDownload; i += 1) {
            createDownloadTask()
        }
    }

    const cancel = (deleteDownloaded = false) => {
        tasks.forEach(task => task.state = 'Cancelled')
        for (const cancelFun of Object.values(cancellation)) {
            cancelFun()
        }
        if (deleteDownloaded) {
            tasks.forEach(task => {
                if (fs.existsSync(task.filePath)) {
                    fs.unlinkSync(task.filePath)
                }
            })
        }
    }

    const retry = async () => {
        for (const task of tasks) {
            if (!await validateFile(task.filePath, task.sha1)){
                task.state = 'Pending'
            } else {
                task.state = 'Success'
            }
        }
        startDownload()
    }

    startDownload()
    return {
        cancel,
        retry
    }
}

function download(URL, filePath, sha1, onProgress = () => {}) {
    ensureDirExist(path.dirname(filePath))
    console.debug(`Begin download ${URL}`)
    const writer = fs.createWriteStream(filePath)
    const stream = got.stream(URL).on('downloadProgress', onProgress)

    return [new Promise((resolve, reject) => {
        pipeline(
            stream,
            writer,
            (err) => {
                if (err) {
                    console.debug(`Fail to download ${URL}`)
                    reject(err)
                }
            }
        )
        writer.on('finish',async () => {
            if (await validateFile(filePath, sha1)) {
                console.debug(`Download ${URL} successfully`)
                resolve(filePath)
            } else {
                console.debug(`Fail to download ${URL}`)
                reject(new Error('Fail to validate'))
            }
        })
        writer.on('error', (e) => {
            console.debug(`Fail to download ${URL}`)
            reject(e)
        })
    }),() => stream.destroy()]
}

function checkRules(rules) {
    let result = true
    if (!rules) return result
    for (let index = 0; index < rules.length; index++) {
        const rule = rules[index];
        if (rule.action === 'disallow' && Object.values(rule.os).includes(system)) {
            result = false
        }
    }
    return result
}

async function scheduleDownloadTasks(
    store,
    name,
    tasks,
    callback,
) {
    const mission = {
        id: v4(),
        state: 'Pending',
        name: name,
    }
    
    const updateState = (state) => {
        store.commit('updateDownloadMissionState', {
            missionID: mission.id,
            missionState: state
        })
    }

    if (!tasks.length) {
        store.dispatch('refreshVersions')
        return
    }
    
    mission.tasks = tasks
    store.commit('addDownloadMission', mission)

    updateState('Downloading')
    const { cancel: cancelRequest, retry: retryMission } = patchDownload(tasks, {
        onProgress(progress) {
            const { tasks, getFailedTasks } = progress
            if (tasks.filter(task => task.state === 'Success' || task.state === 'Failed').length === tasks.length) {
                if (getFailedTasks().length) {
                    mission.state = 'Fail'
                    updateState('Fail')
                } else {
                    mission.state = 'Success'
                    updateState('Success')
                }
                if (callback) {
                    callback(mission.state)
                }
                store.dispatch('refreshVersions')
                return
            }
            store.commit('updateDownloadMission', { id: mission.id, ...progress })
        }
    })

    const cancel = () => {
        updateState('Cancelled')
        cancelRequest()
    }
    const retry = () => {
        updateState('Downloading')
        retryMission()
    }

    store.commit('updateDownloadMission', {cancel, retry,id: mission.id})
    return mission.id
}

module.exports = {
    validateFile,
    checkRules,
    patchDownload,
    system,
    download,
    ensureDirExist,
    getMirror,
    replaceHost,
    scheduleDownloadTasks
}
