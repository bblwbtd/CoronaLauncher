/**
 * @jest-environment node
 */
const { 
    fetchVersionDetail, 
    fetchVersionManifest, 
    findVersion 
} = require('../src/scripts/downloader/version')

async function getManifest() {
    return await fetchVersionManifest()
}

it('testFetchVersionManifest', async () => {
    const manifest = await getManifest()
    expect(manifest).toBeDefined()
}, 60000)

it('testFindVersion', async () => {
    const version = findVersion(await getManifest(), '1.16.1')
    expect(version).toBeDefined()
}, 60000)

it('testFetchVersionDetail', async () => {
    const manifest = await getManifest()
    const version = findVersion(manifest, '1.16.1')
    const versionDetail = await fetchVersionDetail(version.url)
    expect(versionDetail).toBeDefined()
}, 60000)


