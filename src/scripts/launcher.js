const { system } = require('./common')
const { isVitalDependence } = require('./downloader/library')
const path = require('path')
const { getConfig } = require('./config')
const os = require('os')
const { exec } = require('child_process')
const {
    validateAllAsset,
    validateAssetIndex,
    downloadAssetIndex,
    transformAssetObjects2Task
} = require('../scripts/downloader/asset.js') 
const {
    validateClient,
    getClientDownloadTask
} = require('../scripts/downloader/client') 
const { 
    validateLogConfig, 
    getLogDownloadTask 
} = require('../scripts/downloader/log') 
const { 
    validateAllDependencies, 
    transformLibraries2Tasks 
} = require( '../scripts/downloader/library')
const { copyClient } = require('../scripts/client')

async function launch(versionDetail) {
    const config = getConfig()
    const command = buildCommand(
        versionDetail,
        config.currentUsername,
        '123123',
        '123132',
        'Mojang',
        config.width,
        config.height,
        config.maxMemory,
        'CoronaLauncher',
        '0.0.1',
        ''
    )

    console.log(command)
    const childProcess = exec(command)
    
    childProcess.stdout.on('data', (message) => {
        console.log(message)
    })

    childProcess.stdout.on('error', (err) => {
        console.log(err.message.trim())
    })

    childProcess.stderr.on('data', (message) => {
        console.log(message)
    })

    childProcess.on('error', (err) => {
        console.log(err)
    })

    childProcess.on('close', (code, signal) => {
        console.log(code, signal)
    })
    
}

function buildCommand(
    versionDetail,
    playerName,
    authUUID,
    accessToken,
    userType,
    resolutionWidth,
    resolutionHeight,
    maxMemory,
    launcherName,
    launcherVersion,
    isDemo,
) {
    const { assetIndex } = versionDetail
    let command = '';
    if (versionDetail.arguments) {
        command = buildNewVersionCommand(versionDetail)
    }

    const gameArgsMap = {
        '${auth_player_name}': playerName,
        '${version_name}': 'fuckingVersion',
        '${game_directory}': getConfig(true).gameRoot,
        '${assets_root}': getAssetPath(),
        '${auth_uuid}': authUUID,
        '${auth_access_token}': accessToken,
        '${user_type}': userType,
        '${version_type}': 'lala',
        '${resolution_width}': resolutionWidth,
        '${resolution_height}': resolutionHeight,
        '${classpath}': buildClassPath(versionDetail),
        '${launcher_name}': launcherName,
        '${launcher_version}': launcherVersion,
        '${assets_index_name}': assetIndex.id,
        '${natives_directory}': getNativeDir(),
        '${max_memory}': maxMemory
    }

    Object.keys(gameArgsMap).forEach((key) => {
        const value = gameArgsMap[key]
        command = command.replace(key, value)
    })

    if (isDemo) {
        command = command + ' --demo'
    }
    return command
}

function getJavaPath() {
    return `java`
}

function buildNewVersionCommand(versionDetail) {
    const { mainClass } = versionDetail
    const { game, jvm } = versionDetail.arguments
    const gameArgs = buildGameArgs(game)
    const jvmArgs = buildJVMArgs(jvm)
    const javaPath = getJavaPath()
    const logArgs = buildLogConfigPath(versionDetail)

    return `${javaPath} ${jvmArgs} ${logArgs} ${mainClass} ${gameArgs}`
}

function buildLogConfigPath(versionDetail) {
    const { logging } = versionDetail
    const loggingPath = path.join(
        getConfig(true).gameRoot,
        'assets',
        'log_configs',
        logging.client.file.id
    )
    return `-Dlog4j.configurationFile=${loggingPath}`
}

function buildGameArgs(game) {
    const argumentList = []
    for (const argument of game) {
        if (typeof (argument) === 'string') {
            argumentList.push(argument)
        }
    }
    return argumentList.join(' ')
}

function buildJVMArgs(jvm) {
    const argumentList = ['-Xmx${max_memory}']
    for (const argument of jvm) {
        if (typeof (argument) === 'string') {
            argumentList.push(argument)
            continue
        }
        const { rules, value } = argument
        const [rule] = rules
        const operatingSystem = rule.os
        if (operatingSystem.name === system) {
            argumentList.push(typeof(value) === 'string' ? value : value.join(' '))
        } else if (operatingSystem.arch === os.arch()) {
            argumentList.push(typeof(value) === 'string' ? value : value.join(' '))
        }
    }
    return argumentList.join(' ')
}

function buildClassPath(versionDetail) {
    const { libraries, id } = versionDetail
    const librariesPaths = []
    for (const library of libraries) {
        if (isVitalDependence(library)) {
            const libraryPath = path.join(
                getConfig(true).gameRoot,
                'libraries',
                library.downloads.artifact.path
            )
            librariesPaths.push(libraryPath)
        }
    }
    const mainJarFilePath = path.join(getConfig(true).gameRoot, 'versions', id, `${id}.jar`)
    librariesPaths.push(mainJarFilePath)
    return librariesPaths.join(os.platform === 'win32' ? ";" : ":")
}

function getAssetPath() {
    return path.join(getConfig(true).gameRoot, 'assets')
}

function getNativeDir() {
    return getConfig(true).nativePath
}

async function validateResources(versionDetail, name) {
    if (!validateAssetIndex(versionDetail)) {
        const [promise] = downloadAssetIndex(versionDetail)
        await promise
    }

    const assetDownloadTasks = transformAssetObjects2Task(validateAllAsset(versionDetail))

    const libraryDownloadTasks = transformLibraries2Tasks(validateAllDependencies(versionDetail))

    const tasks = [...assetDownloadTasks, ...libraryDownloadTasks]

    const hasClient = validateClient(versionDetail)

    if (!hasClient) {
        tasks.push(getClientDownloadTask(versionDetail))
    } else if(hasClient && versionDetail.id !== name) {
        copyClient(versionDetail.id, name)
    }

    const hasLogConfig = validateLogConfig(versionDetail)

    if (!hasLogConfig) {
        tasks.push(getLogDownloadTask(versionDetail))
    }

    return tasks
}

module.exports = {
    buildCommand,
    launch,
    validateResources
}