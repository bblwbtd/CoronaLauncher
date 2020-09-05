
module.exports = {
    transpileDependencies: ["vuetify"],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "CoronaLauncher",
                copyright: "Copyright © 2020 Neboer",
                mac: {},
                dmg: {
                    window: {
                        width: 800,
                        height: 600
                    }
                }
            }
        },
        i18n: {
            locale: "en",
            fallbackLocale: "cn",
            localeDir: "locales",
            enableInSFC: true
        }
    },
    configureWebpack: {
        plugins: [
        ],
        module: {
            rules: [
                {
                    test: /\.worker\.(c|m)?js$/i,
                    loader: "worker-loader",
                    options: {
                        esModule: false
                    }
                }
            ]
        }
    }
};
