export class WorkerQueue<T> {
    logger: any;
    worker: (payload:T) => void;
    concurrency: any;
    running: number;
    queue: T[];
    constructor({ logger, concurrency = 5 }= {} as {logger?: {error?: Function }, concurrency: number}) {
     
      this.logger = logger;
      this.worker = noop;
  
      this.concurrency = concurrency;
      this.running = -1;
      this.queue = [];
    }
  
    subscribe(worker:(payload:T) => void) {
      // debug('Subscribe to worker queue');
      this.worker = worker;
    }
  
    enqueue(payload:T) {
      // debug('Enqueue event in worker queue');
      if (this.running < this.concurrency -1) {
        this.running++;
        this.execute(payload);
      } else {
        this.queue.unshift(payload);
      }
    }
  
   async pop() {
      // debug('Pop worker queue and execute');
      const payload = this.queue.pop();
  
      if (payload) {
        await this.execute(payload);
      } else {
        this.running--;
      //  setTimeout(()=>{
      //   console.log('this.running', this.running) 
      //   // this.pop()
      // }, 500)
      }
    }
  
    async execute(payload:T) {
      try {
        await this.worker(payload);
      } catch (error) {
        this.logger?.error(error);
      } finally {
        await this.pop();
      }
    }
  };
  
  function noop() {}
  