const axios = require('./common').getAxios()
const { getConfig } = require('./config')

const baseURL = 'https://authserver.mojang.com'
const config = getConfig()

async function officialLogin(username, password) {
    const response = await axios.post(`${baseURL}/authenticate`, {
        "agent": {
            "name": "Minecraft",
            "version": 1
        },
        username,
        password,
        clientToken: config.clientToken,
    })
    console.debug(response)
    return response.data
}

async function officialValidateToken(accessToken) {
    await axios.post(`${baseURL}/validate`, {
        accessToken,
        clientToken: config.clientToken
    })
}

async function officialRefresh(accessToken) {
    const response = await axios.post(`${baseURL}/refresh`, {
        accessToken,
        clientToken: config.clientToken
    })
    return response.data
}

module.exports = {
    officialLogin,
    officialValidateToken,
    officialRefresh
}