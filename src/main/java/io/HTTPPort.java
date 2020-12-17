package io;

import java.util.Scanner;

public class HTTPPort implements IPort {
    private final Integer portNumber;

    private HTTPPort() {
        this.portNumber = setPortNumber();
    }

    public static HTTPPort create() {
        return new HTTPPort();
    }

    @Override
    public int setPortNumber() {
        System.out.print("Enter a port for the server: ");
        Scanner scanner = new Scanner(System.in);
        return scanner.nextInt();
    }

    public Integer getPortNumber() {
        return portNumber;
    }
}
