export class WorkerQueue<T> {
    logger: any;
    worker: (payload:T) => void;
    concurrency: any;
    running: number;
    queue: T[];
    completed?: number;
    constructor({ logger, concurrency = 5 }= {} as {logger?: {error?: Function }, concurrency: number}) {
     
      this.logger = logger;
      this.worker = noop;
  
      this.concurrency = concurrency;
      this.running = 0;
      this.queue = [];
    }
  
    subscribe(worker:(payload:T) => Promise<any>) {
      // debug('Subscribe to worker queue');
      this.worker = worker;
    }
  
    enqueue(payload:T) {
      // debug('Enqueue event in worker queue', this.running , this.concurrency);
      this.queue.unshift(payload);
    }
   delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
   async run() {
      const run = async(q:this): Promise<any> =>{
        // console.log('Enqueue event in worker queue', q.running , q.concurrency, q.queue.length);
        const  jobs: Promise<void>[] = []
        await new Promise((resolve)=>{
          let hasResolved =false
         while (q.running < q.concurrency && q.queue.length>0) {
          this.running++
          const payload = q.queue.pop();
          jobs.push (q._execute(payload as any).then(()=>{
            q.running--;
            if(!hasResolved){
              resolve(undefined)
              hasResolved = true
            }
          }));
          // console.log('Enqueue event done', this.running , this.concurrency, this.queue.length);
        }
       })
      }
      while(!this.completed){
        if (this.queue.length>0) {
         await run(this)
        }else{
          await this.delay(1)
        }
      }
    }
    done(){
      this.completed = 1
      return this
    }
  
    async _execute(payload:T) {
      try {
        await this.worker(payload);
      } catch (error) {
        this.logger?.error(error);
        // console.log('Enqueue event error', error);
      }
    }
  };
  
  function noop() {}
  