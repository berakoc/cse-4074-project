const Handler = {
    handle(content) {
        return `HTTP/1.1 200 OK\r\nContent-Length: ${content.length}\r\nContent-Type: text/html\r\n\r\n${content}`
    }
}

module.exports = Handler