const os = require('os')
const fs = require('fs')

function escapeSpace(input = '') {
    if (os.platform() === 'win32') {
        return input.replace(' ', '" "')
    }
    return input.replace(' ', '\\ ')
}

function ensureDirExist(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

module.exports = {
    escapeSpace,
    ensureDirExist
}