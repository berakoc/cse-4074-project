/**
 * An object for handling proxy responses
 */
const Handler = {
    /**
     * Takes an HTML string and returns a valid HTTP response
     * @param {String} content An HTML content
     */
    handle(content) {
        return `HTTP/1.1 200 OK\r\nContent-Length: ${content.length}\r\nContent-Type: text/html\r\n\r\n${content}`
    },
}

module.exports = Handler
