const { encodeServerInfo, decodeLink } = require("../src/scripts/protocol")

it('Test encode and decode', () => {
    const server = { title: '233', host: 'ldgame.fun', port: 25565, version: '1.16.3' }
    const link = encodeServerInfo(server)
    console.log(link)
    expect(decodeLink(link).title).toEqual('233') 
})