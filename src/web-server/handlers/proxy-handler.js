const ProxyHandler = (Request, Socket) => {
    const URISize = Request['Request-Info'].substring(Request['Request-Info'].indexOf('/') + 1, Request['Request-Info'].indexOf('H') - 1)
    const serverStatus = Socket
    const createResponseHeader = (code, status, contentLength) => {
        return `HTTP/1.1 ${code} ${status}\r\n`
            .concat(`Content-Length: ${contentLength}\r\n`)
            .concat(`Content-Type: text/html\r\n\r\n`)
    }
    let code, status, responseBody, isThereErr = false
    if(URISize > 9999) {
        isThereErr = true
        ;[[code, status], responseBody] = [
            [414, 'REQUEST-URI TOO LONG'],
            '414::Request-URI Too Long',
        ]
    } else if(!serverStatus){
        isThereErr = true
        ;[[code, status], responseBody] = [
            [404, 'NOT FOUND'],
            '404::Not Found',
        ]
    }
    if (isThereErr) {
        Socket.write(
            createResponseHeader(code, status, responseBody.length)
        )
        Socket.write(responseBody)
        Socket.end()
        console.log(`Response sent to the agent[${Request['User-Agent']}].`)
    }
}

module.exports = ProxyHandler