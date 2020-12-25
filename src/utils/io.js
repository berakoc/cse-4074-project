const fs = require('fs')
const HtmlEngine = require('../web-server/renderers/html-engine')
const { DEFAULT_STRUCTURE } = require('../web-server/renderers/structure-store')
const fixedSize = new HtmlEngine(DEFAULT_STRUCTURE('')).render().length
const path = require('path')
const htmlEncode = require('htmlencode').htmlEncode
const { createErrorMethod } = require('./errors')

exports.readFile = (filename) => {
    return fs.readFileSync(filename, 'utf-8')
}

exports.calculateSize = (fileContent) => {
    return Buffer.from(fileContent, 'utf-8').length
}

exports.generateHTMLFile = (size, filename=path.resolve('example.txt')) => {
    let isErrorGiven = false
    if (size < 100 || size > 20000 || !+size) isErrorGiven = true
    const remainingSize = size - fixedSize
    const fileContent = this.readFile(filename)
    return [isErrorGiven ? [400, 'Bad Request'.toUpperCase()] : [200, 'Ok'.toUpperCase()], isErrorGiven ? '400::Bad Request' : new HtmlEngine(DEFAULT_STRUCTURE(htmlEncode(fileContent.slice(0, remainingSize).toString()))).render()]
}