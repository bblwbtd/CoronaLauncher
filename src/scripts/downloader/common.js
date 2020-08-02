const axios = require('axios').default
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const os = require('os')
const config = require('../Config')

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
    const failed = []

    const download = async (task) => {
        downloadingTasks.push(task)
        try{
            await createDownloadTask(task.URL, task.filePath, task.requestConfig)
            success.push(task)
        } catch (error) {
            failed.push(task)
        }
        downloadingTasks = downloadingTasks.filter(item => item.URL != task.URL)
    }

    return new Promise((resolve) => {
        const times = Math.min(remainingTasks.length, config.maxParallelDownload)
        for (let i = 0; i < times; i += 1){
            const task = remainingTasks.pop()
            download(task)
                .then(() => {
                    if (remainingTasks.length > 0) {
                        const task = remainingTasks.pop()
                        download(task)
                    }
                    if (downloadingTasks.length === 0) {
                        resolve([success, failed])
                    }
                })
        }
    })
}

async function createDownloadTask(URL, filePath, requestConfig = {}) {
    ensureDirExist(path.dirname(filePath))
    console.debug(`Begin download ${URL}`)
    const response = await axios.get(URL, {responseType: "stream", ...requestConfig})
    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.debug(`Download ${URL} successfully`)
            resolve(filePath)
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
}