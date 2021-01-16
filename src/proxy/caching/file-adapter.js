const fs = require('fs')
const { resolve } = require('path')
const pageExtension = '.html'
const is = Object.is

const FileAdapter = {
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
    createCachedPage(pageId, content, cacheDir) {
        return fs.writeFileSync(
            resolve(cacheDir, String(pageId).concat(pageExtension)),
            content
        )
    },
}

module.exports = FileAdapter
