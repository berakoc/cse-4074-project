package server.handlers;

public enum HttpCode {
    OK(200),
    BAD_REQUEST(400),
    NOT_IMPLEMENTED(501);

    private int value;

    private HttpCode(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
