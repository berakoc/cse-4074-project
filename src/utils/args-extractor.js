const { arrayToMap } = require('./collections')

const getArgsMap = () => {
    const argsSet = process.argv.slice(2)
    return arrayToMap(argsSet)
}

const checkArgs = (args, predicates) => {
    for (const predicate of predicates) {
        if (!predicate.func(args)) {
            throw new Error(predicate.message)
        }
    }
}

const getPort = (argsMap) => {
    const port = argsMap.get('--port') || argsMap.get('-p')
    if (!port) {
        throw new Error('Given argsMap does not include --port or -p options.')
    }
    return port
}

module.exports = {
    getArgsMap,
    getPort,
    checkArgs,
}
