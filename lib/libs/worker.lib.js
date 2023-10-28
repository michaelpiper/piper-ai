var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class WorkerQueue {
    constructor({ logger, concurrency = 5 } = {}) {
        this.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        this.logger = logger;
        this.worker = noop;
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    subscribe(worker) {
        // debug('Subscribe to worker queue');
        this.worker = worker;
    }
    enqueue(payload) {
        // debug('Enqueue event in worker queue', this.running , this.concurrency);
        this.queue.unshift(payload);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const run = (q) => __awaiter(this, void 0, void 0, function* () {
                // console.log('Enqueue event in worker queue', q.running , q.concurrency, q.queue.length);
                const jobs = [];
                yield new Promise((resolve) => {
                    let hasResolved = false;
                    while (q.running < q.concurrency && q.queue.length > 0) {
                        this.running++;
                        const payload = q.queue.pop();
                        jobs.push(q._execute(payload).then(() => {
                            q.running--;
                            if (!hasResolved) {
                                resolve(undefined);
                                hasResolved = true;
                            }
                        }));
                        // console.log('Enqueue event done', this.running , this.concurrency, this.queue.length);
                    }
                });
            });
            while (!this.completed) {
                if (this.queue.length > 0) {
                    yield run(this);
                }
                else {
                    yield this.delay(1);
                }
            }
        });
    }
    done() {
        this.completed = 1;
        return this;
    }
    _execute(payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.worker(payload);
            }
            catch (error) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(error);
                // console.log('Enqueue event error', error);
            }
        });
    }
}
;
function noop() { }
