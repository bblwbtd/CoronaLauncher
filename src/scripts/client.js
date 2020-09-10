const fs = require('fs')
const path = require('path')
const { getConfig } = require('./config')
const { ensureDirExist } = require('./utils')

function copyClient(from, to) {
    const { gameRoot } = getConfig()
    const fromDirPath = path.join(gameRoot, 'versions', from)
    const toDirPath = path.join(gameRoot, 'versions', to)
    ensureDirExist(fromDirPath)
    ensureDirExist(toDirPath)
    fs.copyFileSync(path.join(fromDirPath, `${from}.jar`), path.join(toDirPath, `${to}.jar`))
    fs.copyFileSync(path.join(fromDirPath, `${from}.json`), path.join(toDirPath, `${to}.json`))
}

module.exports = {
    copyClient  
}