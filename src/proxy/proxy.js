const { createServer, Socket } = require('net')
const { checkArgs } = require('../utils/args-extractor')
const { parseRequestToObject } = require('../utils/request-parser')
const { LOCALHOST } = require('../utils/defined-hosts')
const ProxyHandler = require('../web-server/handlers/proxy-handler')
const FileAdapter = require('./caching/file-adapter')
const Cache = require('./caching/cache')
const { handle } = require('./caching/handler')
const cacheDir = './caching/cached-pages'

/**
 * @type {() => void}
 * @brief
 * A function for connecting proxy server
 */
const connect = () => {
    /**
     * @type {Number|null}
     * @brief Holds the value of the page id when the page is not cached. If it's 
     * cached then the value is null.
     */
    let currentNotCachedPageId
    const cache = new Cache(FileAdapter, cacheDir)
    checkArgs(process.argv, [
        {
            func: (args) => args.length === 5,
            message: 'Arguments should be: <localPort> <remotePort> <isCached>. Your arguments: '.concat(
                JSON.stringify(process.argv.slice(2))
            ),
        },
    ])
    // Destructs the port values from the given args
    const [localPort, remotePort, isCachingEnabled] = process.argv.slice(2)
    // Creates a server and add an onConnect listener
    const server = createServer(function (localSocket) {
        // Creates the remote server socket
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
                '%s::%d > Writing data to server',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            // Creates a ProxyHandler for checking request whether it is valid or not
            const proxyHandler = ProxyHandler(localSocket)
            // Generates errors if there is any problems in request
            proxyHandler.requestError(parseRequestToObject(data))
            const dataString = data.toString()
            let isCached, page
            if (isCachingEnabled === 'true') {
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
                // In the proxy checks if the given page id is cached
                if (pageId) {
                    ;[isCached, page] = cache.getCachedPage(pageId)
                    currentNotCachedPageId = isCached ? null : pageId
                }
            }
            console.log(
                isCached
                    ? 'Obtaining data from the cache'
                    : 'Obtaining from the server'
            )
            // Writes to the client instead of server, if the page is cached
            const flushed = isCached
                ? localSocket.write(handle(page))
                : remoteSocket.write(data)
            if (!flushed) {
                console.log('Server not flushed. Pausing proxy')
                localSocket.pause()
            }
        })

        remoteSocket.on('data', function (data) {
            console.log(
                '%s::%d > Writing data to proxy',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            const dataString = data.toString()
            // If the response from the server contains HTML it caches the content
            // using page id
            if (isCachingEnabled === 'true') {
                if (dataString.includes('<') && currentNotCachedPageId < 9999) {
                    const htmlString = dataString.substring(dataString.indexOf('<'))
                    cache.createCachedPage(
                        currentNotCachedPageId,
                        htmlString
                    )
                }
            }
            const flushed = localSocket.write(data)
            if (!flushed) {
                console.log('Proxy not flushed. Pausing server')
                remoteSocket.pause()
            }
        })

        localSocket.on('drain', function () {
            console.log(
                '%s::%d > Resuming server',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.resume()
        })

        remoteSocket.on('drain', function () {
            console.log(
                '%s::%d > Resuming proxy',
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
                '%s::%d > closing server',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            remoteSocket.end()
        })

        remoteSocket.on('close', function (had_error) {
            console.log(
                '%s:%d > Closing proxy',
                localSocket.remoteAddress,
                localSocket.remotePort
            )
            localSocket.end()
        })
    })

    server.listen(localPort)

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
