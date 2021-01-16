const { createServer, Socket } = require('net')
const { checkArgs } = require('../utils/args-extractor')
const { parseRequestToObject } = require('../utils/request-parser')
const { LOCALHOST } = require('../utils/defined-hosts')
const ProxyHandler = require('../web-server/handlers/proxy-handler')
const FileAdapter = require('./caching/file-adapter')
const Cache = require('./caching/cache')
const { handle } = require('./caching/handler')
const cacheDir = './caching/cached-pages'

const connect = () => {
    let currentNotCachedPageId
    const cache = new Cache(FileAdapter, cacheDir)
    checkArgs(process.argv, [
        {
            func: (args) => args.length === 4,
            message: 'Arguments should be: <localport> <remoteport>. Your arguments: '.concat(
                JSON.stringify(process.argv.slice(2))
            ),
        },
    ])

    const [localPort, remotePort] = process.argv.slice(2)

    const server = createServer(function (localSocket) {
        const remoteSocket = new Socket()
        remoteSocket.connect(remotePort, LOCALHOST)

        localSocket.on('connect', function (data) {
            console.log(
                '>>> connection #%d from %s:%d',
                server.connections,
                localSocket.remoteAddress,
                localSocket.remotePort
            )
        })

        localSocket.on('data', function (data) {
            console.log(
                '%s:%d - writing data to remote',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            const proxyHandler = ProxyHandler(localSocket)
            proxyHandler.requestError(parseRequestToObject(data))
            const dataString = data.toString()
            const pageId = (() => {
                const requestSubstring = dataString.substring(
                    dataString.indexOf('/') + 1
                )
                const requestPath = requestSubstring.substring(
                    0,
                    requestSubstring.indexOf(' ')
                )
                return isNaN(+requestPath) ? null : +requestPath
            })()
            let isCached, page
            if (pageId) {
                ;[isCached, page] = cache.getCachedPage(pageId)
                currentNotCachedPageId = isCached ? null : pageId
            }
            console.log(
                isCached
                    ? 'Obtaining data from the cache'
                    : 'Obtaining from the server'
            )
            const flushed = isCached
                ? localSocket.write(page)
                : remoteSocket.write(data)
            if (!flushed) {
                console.log('  remote not flushed; pausing local')
                localSocket.pause()
            }
        })

        remoteSocket.on('data', function (data) {
            console.log(
                '%s:%d - writing data to local',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            const dataString = data.toString()
            if (dataString.includes('<')) {
                const htmlString = dataString.substring(dataString.indexOf('<'))
                cache.createCachedPage(
                    currentNotCachedPageId,
                    handle(htmlString)
                )
            }
            const flushed = localSocket.write(data)
            if (!flushed) {
                console.log('  local not flushed; pausing remote')
                remoteSocket.pause()
            }
        })

        localSocket.on('drain', function () {
            console.log(
                '%s:%d - resuming remote',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.resume()
        })

        remoteSocket.on('drain', function () {
            console.log(
                '%s:%d - resuming local',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            localSocket.resume()
        })

        remoteSocket.on('error', (err) => {
            const proxyHandler = ProxyHandler(localSocket)
            proxyHandler.serverStatusError(err['errno'])
        })

        localSocket.on('error', (err) => {
            const proxyHandler = ProxyHandler(localSocket)
            proxyHandler.serverStatusError(err['errno'])
        })

        localSocket.on('close', function (had_error) {
            console.log(
                '%s:%d - closing remote',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.end()
        })

        remoteSocket.on('close', function (had_error) {
            console.log(
                '%s:%d - closing local',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            localSocket.end()
        })
    })

    server.listen(localPort)

    console.log(
        'redirecting connections from 127.0.0.1:%d to %s:%d',
        localPort,
        LOCALHOST,
        remotePort
    )
}

if (require.main) {
    connect()
}

exports.connectProxy = connect
