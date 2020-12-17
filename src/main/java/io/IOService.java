package io;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

final public class IOService {
    public static IOService instance = new IOService();

    private IOService() {
    }

    public Integer findBytes(String string) {
        return string.getBytes().length;
    }

    public String readFile(String filename) throws FileNotFoundException {
        StringBuilder fileData = new StringBuilder();
        try (Scanner fileReader = new Scanner(new File(filename))) {
            while (fileReader.hasNextLine()) {
                fileData.append(fileReader.nextLine() + "\n");
            }
        }
        return fileData.toString();
    }
}
