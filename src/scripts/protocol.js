const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const bs58 = require('base-x')(BASE58)

function decodeLink(link) {
    const array = link.split('://')
    if (array[0] !== 'minecraft' || !array[1]) {
        return undefined
    }
    const rawData = bs58.decode(array[1])
    try {
        const data = JSON.parse(rawData)
        return data
    } catch(err) {
        return undefined
    }
}

function encodeServerInfo(server) {
    const buffer = Buffer.from(JSON.stringify(server))
    return `minecraft://${bs58.encode(buffer)}`
}

module.exports = {
    decodeLink,
    encodeServerInfo
}