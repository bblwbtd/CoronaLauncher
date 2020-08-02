const fs = require('fs')
const os = require('os')

function getGameRoot() {
    switch (os.platform()) {
        case 'darwin': 
            return `${os.homedir}/Library/Application Support/minecraft`
        case 'linux':
            return `${os.homedir}/.minecraft`
        case 'win32':
            return '%appdata%\\.minecraft'
        default:
            return `${os.homedir}/.minecraft`
    }
}

const defaultConfig = {
    mirrors: {
        official: {
            versionManifest: 'https://launchermeta.mojang.com/mc/game/version_manifest.json',
            asset: 'http://resources.download.minecraft.net',
            libraries: 'https://libraries.minecraft.net',
            assetIndex: 'https://launchermeta.mojang.com',
            versionList: 'https://launchermeta.mojang.com',
            client: 'https://launcher.mojang.com'
        },
    },
    currentMirror: 'official',
    gameRoot: getGameRoot(),
    maxParallelDownload: 10,
}

let configFromFile = {}

if (fs.existsSync('config.json')) {
    configFromFile = JSON.parse(fs.readFileSync('config.json').toString())
} else {
    fs.writeFileSync('config.json', JSON.stringify(defaultConfig))
}

module.exports = {
    ...defaultConfig,
    ...configFromFile,
}
