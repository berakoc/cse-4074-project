const fs = require('fs')
const { resolve } = require('path')
const pageExtension = '.html'
const is = Object.is

/**
 * An adapter object for local file system based caching
 */
const FileAdapter = {
    /**
     * Gets a cached page if it exists.
     * Returns a tuple of a boolean and string.
     * In case of page does not exist in cached pages, it returns [false, undefined].
     * Otherwise it returns [true, <content-of-page>].
     * @param {Number} pageId An id for the cached page
     * @param {String} cacheDir A directory for cached pages
     * @returns {[Boolean, String]}
     */
    getCachedPage(pageId, cacheDir) {
        const page = fs
            .readdirSync(cacheDir)
            .filter((file) =>
                is(
                    file.substring(0, file.indexOf(pageExtension)),
                    String(pageId)
                )
            )
        return [
            page.length === 1,
            page[0] && fs.readFileSync(resolve(cacheDir, page[0])).toString(),
        ]
    },
    /**
     * Creates a an html file for the given page id and content
     * @param {Number} pageId An id for the page to be created
     * @param {String} content HTML content for the page to be created
     * @param {String} cacheDir A directory for cached pages
     */
    createCachedPage(pageId, content, cacheDir) {
        fs.writeFileSync(
            resolve(cacheDir, String(pageId).concat(pageExtension)),
            content
        )
    },
}

module.exports = FileAdapter
