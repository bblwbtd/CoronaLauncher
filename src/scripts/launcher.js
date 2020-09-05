const { system } = require("./common");
const { isVitalDependence, extractAllNativesLibrary } = require("./downloader/library");
const path = require("path");
const { getConfig, applyAndWriteConfig } = require("./config");
const os = require("os");
const { exec } = require("child_process");
const fs = require('fs')

function launch(versionDetail) {
    return new Promise((resolve, reject) => {
        const config = getConfig();
        config.lastLaunch = versionDetail.id
        applyAndWriteConfig(config)

        let playerName = 'Steve'
        if (config.currentAccount) {
            playerName = config.currentAccount.profile.name
        }
        extractAllNativesLibrary(versionDetail).then(() => {
            const command = buildCommand(
                versionDetail,
                playerName,
                "123123",
                "123132",
                "Mojang",
                config.width,
                config.height,
                config.maxMemory,
                "CoronaLauncher",
                "0.0.1",
                ""
            );
    
            console.log(command);
            const childProcess = exec(command);
    
            childProcess.stdout.once('data', () => resolve())
            childProcess.on('exit', (code) => {
                if (code) {
                    reject(new Error(`${code}`))
                }
                fs.rmdirSync(getNativeDir(), { recursive: true })
            })
    
            childProcess.stdout.on("data", message => {
                console.log("info:" + message);
            });
    
            childProcess.stderr.on("data", message => {
                console.log("error:" + message);
            });
        })
    });
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
    isDemo
) {
    const { assetIndex } = versionDetail;
    let command = "";
    if (versionDetail.arguments) {
        command = buildNewVersionCommand(versionDetail);
    } else {
        command = buildOldVersionCommand(versionDetail)
    }

    const gameArgsMap = {
        "${auth_player_name}": playerName,
        "${version_name}": "fuckingVersion",
        "${game_directory}": `"${getConfig(true).gameRoot}"`,
        "${assets_root}": `"${getAssetPath()}"`,
        "${game_assets}": `"${getAssetPath()}"`,
        "${auth_uuid}": authUUID,
        "${auth_access_token}": accessToken,
        "${user_type}": userType,
        "${version_type}": "lala",
        "${resolution_width}": resolutionWidth,
        "${resolution_height}": resolutionHeight,
        "${classpath}": `"${buildClassPath(versionDetail)}"`,
        "${launcher_name}": launcherName,
        "${launcher_version}": launcherVersion,
        "${assets_index_name}": assetIndex.id,
        "${natives_directory}": getNativeDir(),
        "${max_memory}": maxMemory
    };

    Object.keys(gameArgsMap).forEach(key => {
        const value = gameArgsMap[key];
        command = command.replace(key, value);
    });

    if (isDemo) {
        command = command + " --demo";
    }
    return command;
}

function getJavaPath() {
    return `java`;
}

function buildNewVersionCommand(versionDetail) {
    const { mainClass } = versionDetail;
    const { game, jvm } = versionDetail.arguments;
    const gameArgs = buildGameArgs(game);
    const jvmArgs = buildJVMArgs(jvm);
    const javaPath = getJavaPath();
    const logArgs = buildLogConfigPath(versionDetail);

    return `${javaPath} ${jvmArgs} ${logArgs} ${mainClass} ${gameArgs}`;
}

function buildOldVersionCommand(versionDetail) {
    const { mainClass } = versionDetail;
    const gameArgs = versionDetail.minecraftArguments
    const javaPath = getJavaPath();
    const logArgs = buildLogConfigPath(versionDetail)
    return `${javaPath} ${"-cp ${classpath}"} ${'"-Djava.library.path=${natives_directory}"'} ${'-Xmx${max_memory}'} ${logArgs} ${mainClass} ${gameArgs}`
}

function buildLogConfigPath(versionDetail) {
    const { logging } = versionDetail;
    const loggingPath = path.join(
        getConfig(true).gameRoot,
        "assets",
        "log_configs",
        logging.client.file.id
    );
    return `"-Dlog4j.configurationFile=${loggingPath}"`;
}

function buildGameArgs(game) {
    const argumentList = [];
    for (const argument of game) {
        if (typeof argument === "string") {
            argumentList.push(argument);
        }
    }
    return argumentList.join(" ");
}

function buildJVMArgs(jvm) {
    let argumentList = ["-Xmx${max_memory}"];
    for (const argument of jvm) {
        if (typeof argument === "string") {
            argumentList.push(argument);
            continue;
        }
        const { rules, value } = argument;
        const [rule] = rules;
        const operatingSystem = rule.os;
        if (operatingSystem.name === system) {
            argumentList.push(
                typeof value === "string" ? value : value.join(" ")
            );
        } else if (operatingSystem.arch === os.arch()) {
            argumentList.push(
                typeof value === "string" ? value : value.join(" ")
            );
        }
    }
    argumentList = argumentList.map(arg => {
        if (arg.startsWith('-D')) {
            console.log(arg)
            return `"${arg}"`
        }
        return arg
    })
    return argumentList.join(" ");
}

function buildClassPath(versionDetail) {
    const { libraries, id } = versionDetail;
    const librariesPaths = [];
    for (const library of libraries) {
        if (isVitalDependence(library) && library.downloads.artifact) {
            const libraryPath = path.join(
                getConfig(true).gameRoot,
                "libraries",
                library.downloads.artifact.path
            );
            librariesPaths.push(libraryPath);
        }
    }
    const mainJarFilePath = path.join(
        getConfig(true).gameRoot,
        "versions",
        id,
        `${id}.jar`
    );
    librariesPaths.push(mainJarFilePath);
    return librariesPaths.join(os.platform() === "win32" ? ";" : ":");
}

function getAssetPath() {
    return path.join(getConfig(true).gameRoot, "assets");
}

function getNativeDir() {
    return getConfig(true).nativePath;
}

function validateResources(versionDetail, name) {
    return new Promise(resolve => {
        const temp = require('./validateResources.worker.js')
        const worker = new temp()
        worker.onmessage = event => {
            resolve(event.data)
        }
        worker.postMessage({ versionDetail, name })
    });
}

module.exports = {
    buildCommand,
    launch,
    validateResources
};
