const { nanoid } = require('nanoid')

const $ = (tag) => {
    return `${tag}@${nanoid(12)}`
}

exports.DEFAULT_STRUCTURE = (content) => ({
    type: 'html',
    model: {
        html: {
            head: {
                title: 'Web Page',
            },
            body: content
        }
    }
})