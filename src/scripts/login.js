const { getConfig } = require('./config')
const got = require('got')

const baseURL = 'https://authserver.mojang.com'
const config = getConfig()

async function officialLogin(username, password) {
    console.log(`login ${username} ${password}`)
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
    console.log(body)
    return body
}

async function officialValidateToken(accessToken) {
    console.log(`validate token ${accessToken} ${config.clientToken}`)
    await got.post(`${baseURL}/validate`, {
        json: {
            accessToken,
            clientToken: config.clientToken
        }
    })
}

async function officialRefresh(accessToken) {
    console.log(`refresh token ${accessToken} ${config.clientToken}`)
    const { body } = await got.post(`${baseURL}/refresh`, {
        json: {
            accessToken,
            clientToken: config.clientToken
        },
        responseType: 'json'
    })
    return body
}

async function checkAccount(store) {
    const config = store.state.config;
    const account = config.currentAccount;

    if (account.type === "mojang") {
        try {
            await officialValidateToken(account.accessToken);
            const body = await officialRefresh(account.accessToken);
            account.profile = body.selectedProfile;
            account.accessToken = body.accessToken;
            store.commit("setConfig", config);
        } catch (e) {
            console.log(e);
            try {
                const body = await officialLogin(
                    account.username,
                    account.password
                );
                account.profile = body.selectedProfile;
                account.accessToken = body.accessToken;
                store.commit("setConfig", config);
            } catch (e) {
                console.log(e);
                store.commit("setAccountState", "loginFailed");
                return;
            }
        }
        store.commit("setAccountState", "valid");
        console.log(store.state.accountState);
    }
}

module.exports = {
    officialLogin,
    officialValidateToken,
    officialRefresh,
    checkAccount
}