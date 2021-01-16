const { createServer, Socket } = require("net");
const { LOCALHOST } = require("../utils/defined-hosts");
const { checkArgs } = require('../utils/args-extractor.js')

const connect = () => {
  checkArgs(process.argv, [
    {
        func: (args) => args.length === 4,
        message: 'Arguments should be: <localport> <remoteport>. Your arguments: '.concat(
            JSON.stringify(process.argv.slice(2))
        ),
    },
  ])
  
  
  const [ localPort, remotePort ] = process.argv.slice(2)
  
  const server = createServer(function (localSocket) {
    const remoteSocket = new Socket();
  
    remoteSocket.connect(remotePort, LOCALHOST);
  
    localSocket.on('connect', function (data) {
      console.log(">>> connection #%d from %s:%d",
        server.connections,
        localSocket.remoteAddress,
        localSocket.remotePort
      );
    });
  
    localSocket.on('data', function (data) {
      console.log("%s:%d - writing data to remote",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      const flushed = remoteSocket.write(data);
      if (!flushed) {
        console.log("  remote not flushed; pausing local");
        localSocket.pause();
      }
    });
  
    remoteSocket.on('data', function(data) {
      console.log("%s:%d - writing data to local",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      const flushed = localSocket.write(data);
      if (!flushed) {
        console.log("  local not flushed; pausing remote");
        remoteSocket.pause();
      }
    });
  
    localSocket.on('drain', function() {
      console.log("%s:%d - resuming remote",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      remoteSocket.resume();
    });
  
    remoteSocket.on('drain', function() {
      console.log("%s:%d - resuming local",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      localSocket.resume();
    });
  
    localSocket.on('close', function(had_error) {
      console.log("%s:%d - closing remote",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      remoteSocket.end();
    });
  
    remoteSocket.on('close', function(had_error) {
      console.log("%s:%d - closing local",
        localSocket.remoteAddress,
        localSocket.remotePort
      );
      localSocket.end();
    });
  
  });
  
  server.listen(localPort);
  
  console.log("redirecting connections from 127.0.0.1:%d to %s:%d", localPort, LOCALHOST, remotePort);
}

if (require.main) {
  connect()
}

exports.connectProxy = connect