package server;

import com.sun.net.httpserver.HttpServer;
import io.HTTPPort;
import server.handlers.RootHttpHandler;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    private HTTPPort httpPort;
    private HttpServer serverNode;

    private Server() {
        httpPort = HTTPPort.create();
    }

    public static Server createServer() {
        return new Server();
    }

    public void start() throws IOException {
        serverNode = HttpServer.create(new InetSocketAddress(httpPort.getPortNumber()), 0);
        serverNode.createContext("/", new RootHttpHandler());
        System.out.println("Server started on port::" + httpPort.getPortNumber());
        serverNode.setExecutor(ThreadManager.instance.getThreadPoolExecutor());
        serverNode.start();
    }
}
