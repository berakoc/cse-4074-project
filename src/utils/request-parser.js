exports.parseRequestToObject = (httpRequest) => {
    httpRequest = httpRequest.toString()
    const requestLines = httpRequest.split('\r\n')
    const modifiedRequestLines = requestLines.filter(
        (requestLine) => ~requestLine.indexOf(':')
    )
    const requestInfo = requestLines[0]
    const requestObject = {
        'Request-Info': requestInfo,
    }
    for (const requestLine of modifiedRequestLines) {
        const index = requestLine.indexOf(':')
        requestObject[requestLine.substring(0, index)] = requestLine
            .substring(index + 1)
            .trim()
    }
    return requestObject
}
