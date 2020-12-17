package server;

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class ThreadManager {
    private final Integer MAX_THREADS = 1000;
    public static ThreadManager instance = new ThreadManager();
    private ThreadPoolExecutor threadPoolExecutor;

    private ThreadManager() {
        threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(MAX_THREADS);
    }

    public ThreadPoolExecutor getThreadPoolExecutor() {
        return threadPoolExecutor;
    }
}
