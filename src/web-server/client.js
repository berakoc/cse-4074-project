const Socket = require('net').Socket
const { LOCALHOST } = require('../utils/defined-hosts')
const { nanoid } = require('nanoid')
const run = require('../utils/runner')

const connect = (port) => {
    const clientId = nanoid(12)
    const client = new Socket()
    client.connect(port, LOCALHOST, () => {
        console.log('Connected')
        client.write('GET / HTTP/1.1')
    })
    client.on('data', (data) => {
        console.log(`Received from server :: ${data}`)
    })
    client.on('close', () => {
        console.log('Connection closed.')
    })
    return {
        clientId,
        client,
    }
}

if (require.main) {
    run(connect)
}

exports.connectClient = connect
