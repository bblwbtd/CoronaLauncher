
module.exports = {
    transpileDependencies: ["vuetify"],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: 'fun.ldgame.CoronaLauncher',
                productName: "CoronaLauncher",
                copyright: "Copyright © 2020 Neboer",
                mac: {
                    extendInfo: {
                        CFBundleURLTypes: [
                            {
                                CFBundleTypeRole: 'Viewer',
                                CFBundleURLName: 'minecraft',
                                CFBundleURLSchemes: ['minecraft']
                            }
                        ]
                    }
                },
                dmg: {
                    window: {
                        width: 800,
                        height: 600
                    }
                }
            },
            extraMetadata: {
                name: 'CoronaLauncher'
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
