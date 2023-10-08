import shortid from 'shortid'
import { type AI } from '../ai.js'
import { type MemoryInput } from './memory.node.js'
import { TerminalOutput } from './terminal.node.js'
export interface Output {
  id: string
  sourceId: string
  source: string
  destination?: string
  data: Buffer
  type: {
    mode: 'visual' | 'verbal'
    plain: 'text' | 'audio' | 'image' | 'video'
  }
}
export const outputNode = async (ai: AI) => {
  ai.on('output', async (output: Output) => {
    const cursor = ai.cursor('output')
    ai.emit('memory', { id: ai.id(), action: 'write', doc: { trigger: output.sourceId, data: [{ trigger: output.sourceId, mode: 'output', type: output.type.plain, value: output.data }] } } satisfies MemoryInput)
    if (ai.has('voice') && output.type.mode === 'verbal') {
      if (output.type.plain === 'audio') {
        ai.emit('voice', output.data)
        return
      } else if (output.type.plain === 'text') {
        const gTTS = await import('node-gtts')
        const gtts = gTTS.default('en')
        const words = output.data.toString()
        const voice = ai.cursor('voice')
        await new Promise((resolve, reject)=>gtts.save(voice.resultId.concat('.wav'), words, (error, data)=>{
          if(error){
            reject(error)
            return 
          }
          resolve(data)
        }))
        ai.tap('voice', {id: voice.getId(), data: null})
        return
      }
    }
    if ([null, undefined].includes(output.destination as never) && ai.has('terminal-output')) {
      ai.emit('terminal-output', output as TerminalOutput)
      return
    }
    ai.emit(output.destination!, output)
  })
}
