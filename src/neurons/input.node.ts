import { type AI } from '../ai.js'
import { type MemoryInput } from './memory.node.js'
import { type Output } from './output.node.js'
import { type TextReasoning } from './text-reasoning.node.js'
import shortid from 'shortid'
// import { DBPlugin } from 'zeroant-common/plugins/db.plugin'
export interface Input {
  id: string
  sourceId: string
  source: string
  destination: string
  data: Buffer
  type: {
    mode: 'visual' | 'verbal'
    plain: 'text' | 'audio' | 'image' | 'video'
  }
}
export const inputNode = async (ai: AI) => {
  ai.on('input', (input: Input) => {
    const id = shortid.generate()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ai.on(`result-${id}`, async (data: any) => {
      const memId = shortid.generate()
      ai.emit('memory', { id: memId, action: 'write', doc: { trigger: input.sourceId, data: [{ trigger: input.sourceId, mode: 'input', type: input.type.plain, value: input.data }] } } satisfies MemoryInput)
      await ai.observe(`memory-${memId}`, (v)=>v)
      ai.emit('output', { sourceId: input.sourceId, type: input.type, id: input.id, source: input.source, destination: input.destination, ...data } satisfies Output)
    })
    ai.once(`result-${id}-end`, () => {
      ai.listeners(`result-${id}`).map((listener: any) => ai.off(`result-${id}`, listener))
    })
    ai.emit(input.type.plain + '-reasoning', { sourceId: input.sourceId, data: input.data, id } satisfies TextReasoning)
  })
}
