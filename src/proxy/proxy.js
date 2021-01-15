const { createServer, Socket } = require('net')
const { checkArgs } = require('../utils/args-extractor')
const { LOCALHOST } = require('../utils/defined-hosts')

const connect = () => {
    checkArgs(process.argv, [
        {
            func: (args) => args.length === 4,
            message: 'Arguments should be: <localport> <remoteport>. Your arguments: '.concat(
                JSON.stringify(process.argv.slice(2))
            ),
        },
    ])
    const [localPort, remotePort] = process.argv.slice(2)
    const server = createServer((localSocket) => {
        const remoteSocket = new Socket()
        remoteSocket.connect(remotePort, LOCALHOST)
        localSocket.on('data', (data) => {
            console.log(
                '%s:%d - writing data to remote',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.write(data)
        })
        remoteSocket.on('data', (data) => {
            console.log(
                '%s:%d - writing data to local',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            localSocket.write(data)
        })
        localSocket.on('close', () => {
            console.log(
                '%s:%d - closing remote',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.end()
        })
        remoteSocket.on('close', () => {
            console.log(
                '%s:%d - closing local',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.end()
        })
    })
    server.listen(localPort, LOCALHOST)
    console.log(
        'Redirecting connections from %s:%d to %s:%d',
        LOCALHOST,
        localPort,
        LOCALHOST,
        remotePort
    )
}

if (require.main) {
    connect()
}

exports.connectProxy = connect