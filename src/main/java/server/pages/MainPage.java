package server.pages;

import java.util.Objects;

public class MainPage implements IServerPage {
    private static MainPage instance;
    private final String STYLE = String.join("\n", new String[]{"body { margin: 2vw 3vw; }", "code { font-size: 1.4rem; }"});
    private final String TEMPLATE = String.join("\n", new String[]{"<html>", "<head>",
            String.format("<style>%s</style>", STYLE), "<title>%s</title>", "</head>", "<body>", "<code>%s</code>", "</body>"});

    @Override
    public String render(String title, String content) {
        return String.format(TEMPLATE, title, content);
    }

    public static MainPage getInstance() {
        if (Objects.isNull(instance)) {
            instance = new MainPage();
        }
        return instance;
    }
}
