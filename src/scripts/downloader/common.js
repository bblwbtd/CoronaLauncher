const axios = require('axios').default
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const os = require('os')
const { config } = require('process')

const systemMap = {
    'darwin': 'osx',
    'linux': 'linux',
    'win32': 'windows'
}
const system = systemMap[os.platform()];
let downloadingTask = 0

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

async function download(URL, filePath, requestConfig = {}) {
    
}

async function createDownloadTask(URL, filePath, requestConfig = {}) {
    ensureDirExist(path.dirname(filePath))
    if (config.parallelDownloadNumber > downloadQueue.length) {
        downloadQueue.push({
            URL,
            filePath,
            requestConfig
        })
    }

    const response = await axios.get(URL, {responseType: "stream", ...requestConfig})
    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath))
        writer.on('error', (e) => reject(e))
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
    system,
}
