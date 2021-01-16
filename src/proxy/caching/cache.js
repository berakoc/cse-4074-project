class Cache {
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
