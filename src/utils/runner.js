const { getPort, getArgsMap } = require('./args-extractor')

/**
 * A function for running given connect function
 */
const run = async (connect) => {
    const port = getPort(getArgsMap())
    await connect(port)
    return port
}

module.exports = run
