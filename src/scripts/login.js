const { getConfig } = require('./config')
const got = require('got')

const baseURL = 'https://authserver.mojang.com'
const config = getConfig()

async function officialLogin(username, password) {
    const { body } = await got.post(`${baseURL}/authenticate`, {
        json: {
            "agent": {
                "name": "Minecraft",
                "version": 1
            },
            username,
            password,
            clientToken: config.clientToken,
        },
        responseType: 'json'
    })
    console.debug(body)
    return body
}

async function officialValidateToken(accessToken) {
    await got.post(`${baseURL}/validate`, {
        json: {
            accessToken,
            clientToken: config.clientToken
        }
    })
}

async function officialRefresh(accessToken) {
    const { body } = await got.post(`${baseURL}/refresh`, {
        json: {
            accessToken,
            clientToken: config.clientToken
        },
        responseType: 'json'
    })
    console.debug(body)
    return body
}

module.exports = {
    officialLogin,
    officialValidateToken,
    officialRefresh
}