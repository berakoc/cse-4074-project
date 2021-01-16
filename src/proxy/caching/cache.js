/**
 * @class Represents a virtual cache
 */
class Cache {
    /**
     * Default constructor
     * @param {Object} adapter An adapter for saving and checking pages 
     * @param {String} cacheDir 
     */
    constructor(adapter, cacheDir) {
        this.adapter = adapter
        this.cacheDir = cacheDir
    }

    getCachedPage(pageId) {
        return this.adapter.getCachedPage(pageId, this.cacheDir)
    }

    createCachedPage(pageId, content) {
        return this.adapter.createCachedPage(pageId, content, this.cacheDir)
    }
}

module.exports = Cache
