/**
 * @jest-environment node
 */
const { downloadLogConfig, validateLogConfig } = require('../src/scripts/downloader/log')
const { getConfig } = require('../src/scripts/config')
const versionDetail = require('./1.16.json')
const path = require('path')
const fs = require('fs')


it('testValidateLogConfig', async () => {
    const logConfigPath = path.join(getConfig().gameRoot, 'assets', 'log_configs', 'client-1.12.xml')
    if (fs.existsSync(logConfigPath)) {
        expect(validateLogConfig(versionDetail)).toBeTruthy()
        fs.copyFileSync(logConfigPath, './client-1.12.xml')
        fs.unlinkSync(logConfigPath)
        expect(validateLogConfig(versionDetail)).toBeFalsy()
        fs.copyFileSync('./client-1.12.xml', logConfigPath)
        fs.unlinkSync('./client-1.12.xml')
    } else {
        expect(validateLogConfig(versionDetail)).toBeFalsy()
        await downloadLogConfig(versionDetail)
        expect(validateLogConfig(versionDetail)).toBeTruthy()
    }
}, 60000)