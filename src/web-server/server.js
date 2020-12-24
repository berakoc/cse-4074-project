const net = require('net')
const { LOCALHOST } = require('../utils/defined-hosts')
const { parse } = require('../utils/request-parser')
const run = require('../utils/runner')

const connect = (port) => {
    const server = net.createServer()
    server.listen(port, LOCALHOST)
    server.on('connection', (socket) => {
        console.log(`Connected: ${socket.remoteAddress}::${socket.remotePort}`)
        server.getConnections((_, count) => {
            console.log('Number of concurrent connections to the server : ' + count)
        })
        socket.on('data', (data) => {
            console.clear()
            console.log(`Server is listening on ${LOCALHOST}::${port}`)
            console.log(`Data received from agent :: ${JSON.stringify(parse(data), null, 2)}`)
            socket.write('HTTP/1.0 200 OK\r\n\r\n')
            socket.write('Hello World!\n')
            socket.end()
        })
    })
    server.on('close', () => {
        console.log('Server is closed now.')
    })
}

if (require.main) {
    run(connect)
}

exports.connectServer = connect
