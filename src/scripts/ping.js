const mcping = require("mcping-js");
const ping = require("ping")

function pingServerList(host ,port = 25565) {
    return new Promise((resolve, reject) => {
        const server = new mcping.MinecraftServer(host, port);
        console.log({ host, port })
        server.ping(30000, 0, (err, res) => {
            if (err) {
                reject(err)
                return
            }
            resolve(res)
        });
    })
}

async function pingServerLatency(host) {
    const res = await ping.promise.probe(host, {
        timeout: 10,
        extra: ['-c', '3']
    })
    return res.avg
}

module.exports = {
    pingServerList,
    pingServerLatency
}
