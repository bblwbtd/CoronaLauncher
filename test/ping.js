const { pingServerList, pingServerLatency } = require("../src/scripts/ping");

async function testPingServerList() {
    const res = await pingServerList("mc.hypixel.net")
    console.log(res)
}

async function testPingServerLatency() {
    const res = await pingServerLatency("ldgame.fun")
    console.log(res.avg)
}

testPingServerList()
testPingServerLatency()