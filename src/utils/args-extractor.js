const { arrayToMap } = require('./collections')

/**
 * Gets arguments as a map for server and client
 */
const getArgsMap = () => {
    const argsSet = process.argv.slice(2)
    return arrayToMap(argsSet)
}

/**
 * 
 * @param {Array<String>} args Script arguments
 * @param {Array<{func: (v: any) => Boolean, message: String}>} predicates A set of predicates for checking the args
 */
const checkArgs = (args, predicates) => {
    for (const predicate of predicates) {
        if (!predicate.func(args)) {
            throw new Error(predicate.message)
        }
    }
}

/**
 * Gets the port value for the given script
 * @param {Map} argsMap A map of program args
 */
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
