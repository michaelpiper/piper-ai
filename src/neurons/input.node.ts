import { type AI } from '../ai.js'
import { type MemoryInput } from './memory.node.js'
import { type Output } from './output.node.js'
import { type TextReasoning } from './text-reasoning.node.js'
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
    const reasoning = ai.cursor(input.type.plain + '-reasoning')
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    reasoning.onResult(async (data: any) => {
      const memory = ai.cursor('memory')
      const output = ai.cursor('output')
      memory.request<MemoryInput>({id: memory.getId(), action: 'write', doc: { trigger: input.sourceId, data: [{ trigger: input.sourceId, mode: 'input', type: input.type.plain, value: input.data }] } })
      await ai.observe(memory.resultId, (v)=>v)
      output.result<Output>({ sourceId: input.sourceId, type: input.type, id: input.id, source: input.source, destination: input.destination, ...data })
    })
    reasoning.onceEnd(() => {
      reasoning.off('result')
    })
    reasoning.request<TextReasoning>( { sourceId: input.sourceId, data: input.data, id: reasoning.getId() })
  })
}
