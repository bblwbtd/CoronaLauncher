const os = require('os')

function escapeSpace(input = '') {
    if (os.platform() === 'win32') {
        return input.replace(' ', '" "')
    }
    return input.replace(' ', '\\ ')
}

module.exports = {
    escapeSpace
}