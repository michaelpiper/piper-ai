export declare class WorkerQueue<T> {
    logger: any;
    worker: (payload: T) => void;
    concurrency: any;
    running: number;
    queue: T[];
    completed?: number;
    constructor({ logger, concurrency }?: {
        logger?: {
            error?: Function | undefined;
        } | undefined;
        concurrency: number;
    });
    subscribe(worker: (payload: T) => Promise<any>): void;
    enqueue(payload: T): void;
    delay: (ms: number) => Promise<unknown>;
    run(): Promise<void>;
    done(): this;
    _execute(payload: T): Promise<void>;
}
//# sourceMappingURL=worker.lib.d.ts.map