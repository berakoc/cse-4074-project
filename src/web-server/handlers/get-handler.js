const { createErrorMethod } = require('../../utils/errors')
const { generateHTMLFile } = require('../../utils/io')
const { Socket } = require('net')

/**
 * Default handler for the web server
 * @param {Object} httpRequestHeader An object contains request header values in object notation
 * @param {Socket} socket Server socket
 */
const GetHandler = (httpRequestHeader, socket) => {
    const $requestHeader = httpRequestHeader
    const $socket = socket
    const notImplementedRequestMethods = [
        'PUT',
        'HEAD',
        'DELETE',
        'POST',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH',
    ]
    const createResponseHeader = (code, status, contentLength) => {
        return `HTTP/1.1 ${code} ${status}\r\n`
            .concat(`Content-Length: ${contentLength}\r\n`)
            .concat(`Content-Type: text/html\r\n\r\n`)
    }
    return {
        /**
         * Returns the value of the key given in the request header object.
         * Returns an error function if key is not found.
         * @param {String} key Request header key
         */
        getRequestValue: (key) => {
            return (
                $requestHeader[key] ||
                createErrorMethod('Key is not found in request header.')
            )
        },
        /**
         * Core handling method for the web server
         * Checks all constraints and returns a valid HTTP response
         */
        handle: () => {
            const requestInfo = $requestHeader['Request-Info']
            const requestMethod = requestInfo.substring(
                0,
                requestInfo.indexOf(' ')
            )
            const size = (() => {
                const subRequestInfo = requestInfo.substring(
                    requestInfo.indexOf('/') + 1
                )
                return subRequestInfo.substring(0, subRequestInfo.indexOf(' '))
            })()
            let code, status, responseBody
            if (requestMethod === 'GET') {
                ;[[code, status], responseBody] = generateHTMLFile(size)
            } else if (notImplementedRequestMethods.includes(requestMethod)) {
                ;[[code, status], responseBody] = [
                    [501, 'NOT IMPLEMENTED'],
                    '501::Not Implemented',
                ]
            } else {
                ;[[code, status], responseBody] = [
                    [400, 'BAD REQUEST'],
                    '400::Bad Request',
                ]
            }
            $socket.write(
                createResponseHeader(code, status, responseBody.length)
            )
            $socket.write(responseBody)
            $socket.end()
            console.log(
                `Response sent to the agent[${$requestHeader['User-Agent']}].`
            )
        },
    }
}

module.exports = GetHandler
