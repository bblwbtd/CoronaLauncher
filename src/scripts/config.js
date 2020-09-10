const fs = require('fs')
const os = require('os')
const path = require('path')
// const { escapeSpace } = require('./utils')
const { v4 } = require('uuid')
const { ensureDirExist } = require('./utils')

function getGameRoot() {
    switch (os.platform()) {
        case 'darwin': 
            return `${os.homedir}/Library/Application Support/minecraft`
        case 'linux':
            return `${os.homedir}/.minecraft`
        case 'win32':
            return `${os.homedir}\\.minecraft`
        default:
            return `${os.homedir}/.minecraft`
    }
}

function getConfigDir() {
    switch (os.platform()) {
        case 'darwin':
            return `${os.homedir}/Library/Application Support/CoronaLauncher`
        case 'linux':
            return `${os.homedir}/.config`
        case 'win32':
            return `${os.homedir}\\CoronaLauncher`
    }
}

function getCacheDir() {
    switch (os.platform()) {
        case 'darwin':
            return `${os.homedir}/Library/Caches/CoronaLauncher`
        case 'linux':
            return `${os.homedir}/.cache`
        case 'win32':
            return `${os.homedir}\\CoronaLauncher\\cache` 
    }
}

const configDir = getConfigDir()
const configPath = path.join(configDir, 'config.json')

const defaultConfig = {
    mirrors: {
        official: {
            versionManifest: 'launchermeta.mojang.com/mc/game/version_manifest.json',
            asset: 'resources.download.minecraft.net',
            libraries: 'libraries.minecraft.net',
            assetIndex: 'launchermeta.mojang.com',
            client: 'launcher.mojang.com'
        },
        // BMCLAPI: {
        //     versionManifest: 'bmclapi2.bangbang93.com/mc/game/version_manifest.json',
        //     asset: 'bmclapi2.bangbang93.com/assets',
        //     assetIndex: 'bmclapi2.bangbang93.com',
        //     libraries: 'bmclapi2.bangbang93.com/maven',
        //     client: 'bmclapi2.bangbang93.com'
        // }
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
    clientToken: v4(),
    versionConfig: {},
    lastLaunch: 'Latest',
}

let configFromFile = {}

if (fs.existsSync(configPath)) {
    configFromFile = JSON.parse(fs.readFileSync(configPath).toString())
}

function getConfig() {
    const config = {
        ...defaultConfig,
        ...configFromFile,
    }

    return config
}

function writeConfig(config) {
    ensureDirExist(configDir)
    fs.writeFileSync(configPath ,JSON.stringify(config))
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
    getCacheDir,
    writeConfig,
    applyConfig,
    applyAndWriteConfig
}
