package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import io.IOService;
import org.apache.commons.text.StringEscapeUtils;
import server.pages.MainPage;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class RootHttpHandler implements HttpHandler {
    private final String[] REQUEST_METHODS = {"GET", "POST", "HEAD"};
    private final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String responseValue = null;
        HttpCode httpCode = HttpCode.OK;
        final String requestMethod = httpExchange.getRequestMethod();
        if ("GET".equals(requestMethod)) {
            responseValue = handleGetRequest(httpExchange);
        } else if (Arrays.asList(REQUEST_METHODS).contains(requestMethod)) {
            responseValue = "HTTP/1.0 methods except GET is unavailable.";
            httpCode = HttpCode.NOT_IMPLEMENTED;
        } else {
            responseValue = String.format("%s is not a valid HTTP/1.0 method.", requestMethod);
            httpCode = HttpCode.BAD_REQUEST;
        }
        handleResponse(httpExchange, responseValue, httpCode);
    }

    private int getDataLength(String value) {
        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return -1;
    }

    private String handleGetRequest(HttpExchange httpExchange) throws FileNotFoundException {
        String[] uriParts = httpExchange.getRequestURI().toString().split("/");
        String lastPart = uriParts[uriParts.length - 1];
        Integer dataLength = getDataLength(lastPart);
        return IOService.instance.readFile("example.txt").substring(0, dataLength);
    }

    private void handleResponse(HttpExchange httpExchange, String responseValue, HttpCode httpCode)
            throws IOException {
        try (OutputStream outputStream = httpExchange.getResponseBody()) {
            String htmlResponse = MainPage.getInstance().render("HTTP/1.0 Page",
                    StringEscapeUtils.escapeHtml4(responseValue));
            byte[] responseByteValue = htmlResponse.getBytes(DEFAULT_CHARSET);
            httpExchange.sendResponseHeaders(httpCode.getValue(), responseByteValue.length);
            outputStream.write(responseByteValue);
        }
    }
}
