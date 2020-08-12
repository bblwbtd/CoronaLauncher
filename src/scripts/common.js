const axios = require('axios').default
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const os = require('os')
const { getConfig } = require('./config')

const systemMap = {
    'darwin': 'osx',
    'linux': 'linux',
    'win32': 'windows'
}
const system = systemMap[os.platform()];
let downloadingTasks = []
let remainingTasks = []

function validateFile(path, hash) {
    if(fs.existsSync(path)){
        if(hash == null){
            return true
        }
        let buf = fs.readFileSync(path)
        let actualHash = crypto.createHash('sha1').update(buf).digest('hex')
        return actualHash === hash.toLowerCase()
    }
    return false
}

function ensureDirExist(dirPath){
    fs.mkdirSync(dirPath, {recursive: true})
}

async function patchDownload(tasks = []) {
    remainingTasks = tasks
    const success = []
    let failed = []

    const downloadItem = async (task) => {
        downloadingTasks.push(task)
        try{
            await download(
                task.URL, 
                task.filePath, 
                task.sha1, 
                task.requestConfig
            )
            success.push(task)
        } catch (error) {
            console.log(error)
            failed.push(task)
        }
        downloadingTasks = downloadingTasks.filter(item => item.URL != task.URL)
    }

    const createDownloadTask = async () => {
        while(remainingTasks.length > 0) {
            const task = remainingTasks.pop()
            await downloadItem(task)
        }
    }

    const downloadTasks = []
    for (let i = 0; i < getConfig().maxParallelDownload; i += 1) {
        downloadTasks.push(createDownloadTask())
    }
    await Promise.allSettled(downloadTasks)

    for (const failedTask of failed) {
        if (validateFile(failedTask.filePath, failedTask.sha1)) {
            failed = failed.filter(item => item.URL != failedTask.URL)
        }
    }

    return [success, failed]
}

async function download(URL, filePath, sha1, requestConfig = {}) {
    ensureDirExist(path.dirname(filePath))
    console.debug(`Begin download ${URL}`)
    const response = await axios.get(URL, {responseType: "stream", ...requestConfig})
    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            if (validateFile(filePath, sha1)) {
                console.debug(`Download ${URL} successfully`)
                resolve(filePath)
            } else {
                reject()
            }
        })
        writer.on('error', (e) => {
            console.debug(`Fail to download ${URL}`)
            reject(e)
        })
    })
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



module.exports = {
    getAxios: () => axios,
    validateFile,
    checkRules,
    patchDownload,
    system,
    downloadingTasks,
    remainingTasks,
    download,
    ensureDirExist,
}
