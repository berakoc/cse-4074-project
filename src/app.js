const { connectServer } = require("./web-server/server");
const { getPort, getArgsMap } = require('./utils/args-extractor')

const port = getPort(getArgsMap())

const main = async () => {
    await connectServer(port)
}

main().then(() => console.log(`Server has started on http://localhost:${port}`))
