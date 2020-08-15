const fs = require('fs')
const os = require('os')
const path = require('path')
const { escapeSpace } = require('./utils')
const { v4 } = require('uuid')

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
    nativePath: path.join(getGameRoot(), 'bin'),
    accounts: [
        {
            id: '2333',
            username: 'Steve',
            accessToken: '123456',
            password: '123456',
            type: 'offline',
            profile: {
                name: 'Steve'
            }
        }
    ],
    currentAccount: {
        id: '2333',
        username: 'Steve',
        accessToken: '123456',
        password: '123456',
        type: 'offline',
        profile: {
            name: 'Steve'
        }
    },
    width: 800,
    height: 600,
    maxMemory: '2G',
    language: 'en',
    closeLauncherOnStart: false,
    clientToken: v4()
}

let configFromFile = {}

if (fs.existsSync('config.json')) {
    configFromFile = JSON.parse(fs.readFileSync('config.json').toString())
}

function getConfig(isEscapeSpace = false) {
    const config = {
        ...defaultConfig,
        ...configFromFile,
    }

    if (isEscapeSpace) {
        config.gameRoot = escapeSpace(config.gameRoot)
        config.nativePath = escapeSpace(config.nativePath) 
    }
    return config
}

function writeConfig(config) {
    fs.writeFileSync('config.json' ,JSON.stringify(config))
}

function applyConfig(config) {
    configFromFile = config
}

function applyAndWriteConfig(config) {
    applyConfig(config)
    writeConfig(config)
}

module.exports = {
    getConfig,
    writeConfig,
    applyConfig,
    applyAndWriteConfig
}
