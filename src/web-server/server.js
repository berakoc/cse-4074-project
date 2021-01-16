const net = require('net')
const { LOCALHOST } = require('../utils/defined-hosts')
const { parseRequestToObject } = require('../utils/request-parser')
const run = require('../utils/runner')
const GetHandler = require('./handlers/get-handler')

/**
 * Default connection method for the web server
 * @param {Number} port Server port
 */
const connect = (port) => {
    const server = net.createServer()
    server.listen(port, LOCALHOST)
    server.on('connection', (socket) => {
        socket.on('data', (data) => {
            console.clear()
            console.log(`Server is listening on ${LOCALHOST}::${port}`)
            console.log(
                `Request received from agent :: ${data
                    .toString()
                    .substring(0, data.toString().indexOf('\r\n'))}`
            )
            // Delegates a GetHandler for handling requests
            const getHandler = GetHandler(parseRequestToObject(data), socket)
            getHandler.handle()
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
