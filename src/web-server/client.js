const Socket = require('net').Socket
const { LOCALHOST } = require('../utils/defined-hosts')
const { nanoid } = require('nanoid')
const run = require('../utils/runner')

const connect = (port) => {
    const clientId = nanoid(12)
    const client = new Socket()
    client.connect(port, LOCALHOST, () => {
        console.log('Connected')
        client.write(`Hello server! Love Client@${clientId}.`)
    })
    client.on('data', (data) => {
        console.log(`Received: ${data}`)
        client.destroy()
    })
    client.on('close', () => {
        console.log('Connection closed.')
    })
    return {
        clientId,
        client
    }
}

if (require.main) {
    run(connect)
}

exports.connectClient = connect
