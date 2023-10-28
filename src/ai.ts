import { storeNode } from './neurons/store.node.js'
import { terminalNode } from './neurons/terminal.node.js'
import { memoryNode } from './neurons/memory.node.js'
import { outputNode } from './neurons/output.node.js'
import { inputNode } from './neurons/input.node.js'
import { textReasoningNode } from './neurons/text-reasoning.node.js'
import { ClientSession, Collection, MongoClient, Document } from 'mongodb'
import shortid from 'shortid'
import { researchNode } from './neurons/research.node.js'
import { dictionaryNode } from './neurons/dictionary.node.js'
import { SusXSubscription } from 'susx'
import { bootNode } from './neurons/boot.node.js'
import { welcomeNode } from './neurons/welcome.node.js'
import { voiceNode } from './neurons/voice.node.js'
export class AIError extends Error {

}
interface Ctx {

  onceEndListeners: Function[]
  onEndListeners: Function[]

  onceResultListeners: Function[]
  onResultListeners: Function[]

  onceRequestListeners: Function[]
  onRequestListeners: Function[]

}
const ctx: Ctx = {
  onceEndListeners: [],
  onEndListeners: [],

  onceResultListeners: [],
  onResultListeners: [],

  onceRequestListeners: [],
  onRequestListeners: []
}
export class AICursor<Request = any, Response = any, End = any> extends String {
  constructor(private ai: AI, value: string){
    super(value)
  }
  _id = shortid.generate()


  get resultId() {
    return this.concat('-').concat(this._id)
  }

  getId() {
    return this._id
  }

  request<T = Request>(input: T, t: 'emit'|'broadcast'| 'tap' = 'emit'): boolean {
    return this.ai[t](this.requestId, input, this.getId()) as never
  }

  result<T = Response>(input: T, t: 'emit'|'broadcast'| 'tap' = 'emit'): boolean {
    return this.ai[t](this.resultId, input, this.getId())as never
  }

  end<T = End>(input?: T, t: 'emit'|'broadcast'| 'tap' = 'emit'): boolean {
    return this.ai[t](this.endId, input, this.getId()) as never
  }
  onResult(listener: Function) {
    ctx.onResultListeners.push(listener)
    return this.ai.on(this.resultId, listener as any)
  }

  onceResult(listener: Function) {
    ctx.onceResultListeners.push(listener)
    return this.ai.on(this.resultId, listener as any)
  }

  onEnd(listener: Function) {
    ctx.onEndListeners.push(listener)
    return this.ai.on(this.endId, listener as any)
  }
  onceEnd(listener: Function) {
    ctx.onceEndListeners.push(listener)
    return this.ai.once(this.endId, listener as any)
  }

  off(event: 'end' | 'onEnd' | 'onceEnd' | 'onResult' | 'onceResult' | 'result' | 'onRequest' | 'onceRequest' | 'request' | 'all') {
    switch (event) {
      case 'all':
      case 'end':
      case 'onceEnd':
        this._offOnceEnd()
      case 'all':
      case 'end':
      case 'onEnd':
        this._offOnEnd()
      case 'all':
      case 'result':
      case 'onResult':
        this._off(ctx.onResultListeners)
      case 'all':
      case 'result':
      case 'onceResult':
        this._off(ctx.onceResultListeners)
      case 'all':
      case 'request':
      case 'onRequest':
        this._off(ctx.onRequestListeners)
      case 'all':
      case 'request':
      case 'onceRequest':
        this._off(ctx.onceRequestListeners)
    }
  }
  _offOnceEnd() {
    this._off(ctx.onceEndListeners)
  }
  _offOnEnd() {
    this._off(ctx.onEndListeners)
  }
  _off(listeners: Function[]) {
    let listener: Function | undefined = undefined
    while ((listener = listeners.pop()) !== undefined) {
      this.ai.off(this.requestId, listener as any)
    }
  }
  _offX(listeners: Function[]) {
    let listener: Function | undefined = undefined
    while ((listener = listeners.shift()) !== undefined) {
      this.ai.off(this.requestId, listener as any)
    }
  }


  get requestId() {
    return this.toString()
  }

  get endId() {
    return this.concat('-').concat(this._id).concat('-end')
  }
}
export class AI extends SusXSubscription {

  store!: MongoClient
  #id: number = 1
  cursorType = ['ticker']
  constructor(public config: Record<string, string|number|undefined>){
    super()
  }
  id(): string {
    return (this.#id++).toString();
  }
  addNeuron(neuron: (ai: this) => any): this {
    neuron(this)
    return this
  }

  document(name: string, dbName?: string) {
    return this.store.db(dbName).collection(name)
  }

  documentWithSession(name: string, dbName?: string): [ClientSession, Collection<Document>]{
    const session = this.store.startSession()
    return [session, this.document(name, dbName)]
  }

  cursor<Req, Res, End, >(name: string, id?: string): AICursor<Req, Res, End> {
    const result = new AICursor<Req, Res, End>(this, name)
    if (id !== undefined && id !== null) {
      result._id = id
    }
    return result
  }

  async initialize() {
    if (this.config.DATABASE_URL === null || this.config.DATABASE_URL === undefined) {
      throw new AIError('unable to create store require a db')
    }
    this.config.CURRENT_DB_RETRIES ??= 0
    this.config.MAX_DB_RETRIES ??= 5
    if(this.config.CURRENT_DB_RETRIES >= this.config.MAX_DB_RETRIES){
      console.log("retrying db connection reach maximum allowed")
     return;
    }
    (this.config.CURRENT_DB_RETRIES as number)++
    this.store = await MongoClient.connect(this.config.DATABASE_URL as string)
    this.store.once('error', (error)=>{
      console.error(error)
      this.initialize()
      console.log("retrying db connection")
    })
  }
  connect() {
    this.broadcast('boot', Date.now())
  }
}
export const createAI = (config: Record<string, string|undefined>) => new AI(config)
  .addNeuron(storeNode)
  .addNeuron(terminalNode)
  .addNeuron(memoryNode)
  .addNeuron(outputNode)
  .addNeuron(inputNode)
  .addNeuron(researchNode)
  .addNeuron(bootNode)
  .addNeuron(welcomeNode)
  .addNeuron(voiceNode)
  .addNeuron(dictionaryNode)
  .addNeuron(textReasoningNode)