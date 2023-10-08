import { storeNode } from './neurons/store.node.js'
import { terminalNode } from './neurons/terminal.node.js'
import { memoryNode } from './neurons/memory.node.js'
import { outputNode } from './neurons/output.node.js'
import { inputNode } from './neurons/input.node.js'
import { textReasoningNode } from './neurons/text-reasoning.node.js'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import shortid from 'shortid'
import { researchNode } from './neurons/research.node.js'
import { dictionaryNode } from './neurons/dictionary.node.js'
import { SusXSubscription } from 'susx'
import { bootNode } from './neurons/boot.node.js'
import { welcomeNode } from './neurons/welcome.node.js'
import { voiceNode } from './neurons/voice.node.js'
export class AIError extends Error {

}
export class AICursor<Request=any, Response=any, End=any> extends String {
  _id = shortid.generate()

  get resultId () {
    return this.concat('-').concat(this._id)
  }

  getId () {
    return this._id
  }

  request<T= Request>(input: T) {
    return ai.emit(this.requestId, input)
  }

  result<T= Response>(input: T) {
    return ai.emit(this.resultId, input)
  }

  end<T= End>(input?: T) {
    return ai.emit(this.endId, input)
  }

  get requestId () {
    return this.toString()
  }

  get endId () {
    return this.concat('-').concat(this._id).concat('-end')
  }
}
export class AI extends SusXSubscription {
  store!: MongoClient
  #id:number = 1
  
  id(): string{
    return (this.#id++).toString();
  }
  addNeuron (neuron: (ai: this) => any): this {
    neuron(this)
    return this
  }

  document (name: string, dbName?: string) {
    return this.store.db(dbName).collection(name)
  }

  cursor<Req, Res, End>(name: string, id?: string): AICursor<Req, Res, End> {
    const result = new AICursor<Req, Res, End>(name)
    if (id !== undefined && id !== null) {
      result._id = id
    }
    return result
  }

  async initialize () {
    config()
    if (process.env.DATABASE_URL === null || process.env.DATABASE_URL === undefined) {
      throw new AIError('unable to create store require a db')
    }
    this.store = await MongoClient.connect(process.env.DATABASE_URL as string)
  }
  connect(){
   this.broadcast('boot', Date.now())
  }
}
export const ai = new AI()
ai.addNeuron(storeNode)
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

await ai.initialize()
