const { Socket } = require('net')

/**
 * Same as GetHandler yet it is dedicated for Proxy handling
 * @param {Socket} Socket Proxy socket
 */
const ProxyHandler = (Socket) => {
    const createResponseHeader = (code, status, contentLength) => {
        return `HTTP/1.1 ${code} ${status}\r\n`
            .concat(`Content-Length: ${contentLength}\r\n`)
            .concat(`Content-Type: text/html\r\n\r\n`)
    }

    return {
        requestError: (Request) => {
            const URISize = Request['Request-Info'].substring(
                Request['Request-Info'].indexOf('/') + 1,
                Request['Request-Info'].indexOf('H') - 1
            )
            let code,
                status,
                responseBody,
                isThereErr = false
            if (URISize > 9999) {
                isThereErr = true
                ;[[code, status], responseBody] = [
                    [414, 'REQUEST-URI TOO LONG'],
                    '414::Request-URI Too Long',
                ]
            }
            if (isThereErr) {
                if (responseBody == undefined) {
                    responseBody = ''
                }
                Socket.write(
                    createResponseHeader(code, status, responseBody.length)
                )
                Socket.write(responseBody)
                console.log(
                    `Response sent to the agent[${Request['User-Agent']}].`
                )
            }
        },
        serverStatusError: (err) => {
            let code,
                status,
                responseBody,
                isThereErr = false
            if (err == 'ECONNREFUSED') {
                isThereErr = true
                ;[[code, status], responseBody] = [
                    [404, 'NOT FOUND'],
                    '404::Not Found',
                ]
            }
            if (isThereErr) {
                if (responseBody == undefined) {
                    responseBody = ''
                }
                Socket.write(
                    createResponseHeader(code, status, responseBody.length)
                )
                Socket.write(responseBody)
            }
        },
    }
}

module.exports = ProxyHandler
