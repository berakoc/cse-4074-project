const net = require('net')
const { LOCALHOST } = require('../utils/defined-hosts')
const run = require('../utils/runner')

const connect = (port) => {
    const server = net.createServer()
    server.listen(port, LOCALHOST)
    console.log(`Server is listening on ${LOCALHOST}::${port}`)
    server.on('connection', socket => {
        console.log(`Connected: ${socket.remoteAddress}::${socket.remotePort}`)
        socket.pipe(socket)
    })
}

if (require.main) {
    run(connect)
}

exports.connectServer = connect
