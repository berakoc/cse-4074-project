const { getPort, getArgsMap } = require('./args-extractor')

const run = async (connect) => {
    const port = getPort(getArgsMap())
    await connect(port)
    return port
}

module.exports = run
