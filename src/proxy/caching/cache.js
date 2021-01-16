/**
 * @class Represents a virtual cache
 */
class Cache {
    /**
     * Default constructor
     * @param {{getCachedPage: (pageId: Number, cacheDir: String) => [Boolean, String], createCachedPage: (pageId: Number, content: String, cacheDir: String) => void}} adapter An adapter for saving and checking pages 
     * @param {String} cacheDir A directory for cached pages
     */
    constructor(adapter, cacheDir) {
        this.adapter = adapter
        this.cacheDir = cacheDir
    }

    /**
     * Wrapper method for the adapters getCachedPage function
     * @param {number} pageId An id for the cached page
     * @returns {[Boolean, String]}
     * @see Cache.adapter
     */
    getCachedPage(pageId) {
        return this.adapter.getCachedPage(pageId, this.cacheDir)
    }

    /**
     * 
     * @param {Number} pageId An id for the page to be created
     * @param {String} content HTML content for the page to be created
     */
    createCachedPage(pageId, content) {
        this.adapter.createCachedPage(pageId, content, this.cacheDir)
    }
}

module.exports = Cache
