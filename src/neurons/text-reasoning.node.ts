import shortid from 'shortid'
import { type AI } from '../ai.js'
import { type MemoryInput, type Memory } from './memory.node.js'
import { type ResearchOutput, type ResearchInput } from './research.node.js'
import { AIReasoning, AIReasoningInput } from 'piper-ai-reasoning'
export interface TextReasoning {
  id: string
  sourceId: string
  data: Buffer
}
const findLastIndex = (array: Memory['data'], matcher: string) => {
  const nodes = Array.from(array)
  // nodes.reverse()
  let found = false
  for (const node of nodes) {
    if (node.value.toString() === matcher) {
      found = true
      continue
    }
    if (found && node.mode === 'input') {
      return node
    }
  }
  return null
}

// ai.on(`memory-${id}`, (memory: Memory | null) => {
//   // console.log('debug', memory)
//   if (memory === null) {
//     const research = ai.cursor('research')
//     ai.on(research.resultId, (output: ResearchOutput) => {
//       // console.log('research- result', output.data)
//       ai.emit(`result-${reasoning.id}`, { data: output.data })
//     })
//     research.request<ResearchInput>({ type: 'text', data: reasoning.data, id: research.getId() })
//     // ai.emit(`memory-${id}-end`, true)
//     return
//   }
//   const data = memory.data
//   const result = findLastIndex(data, reasoning.data.toString())
//   // console.log(result, data)
//   if (result === null) {
//     const research = ai.cursor('research')
//     // console.log('research', research.name, research.id)
//     ai.on(research.resultId, (output: ResearchOutput) => {
//       // console.log('research- result', output.data)
//       ai.emit(`result-${reasoning.id}`, { data: output.data })
//     })
//     research.request<ResearchInput>({ type: 'text', data: reasoning.data, id: research.getId() })
//     return
//   }
//   ai.emit(`result-${reasoning.id}`, { data: result.value })
//   ai.emit(`memory-${id}-end`, true)
// })
// ai.on(`memory-${id}-end`, (gracefully: boolean) => {
//   if (!gracefully) {
//     ai.emit(`result-${reasoning.id}`, { data: reasoning.data })
//   }
// })
// ai.emit('memory', { id, action: 'read', doc: { trigger: reasoning.sourceId } } satisfies MemoryInput)
export const textReasoningNode = (ai: AI) => {
  ai.on('text-reasoning', (reasoning: TextReasoning) => {
    const cursor = ai.cursor('text-reasoning', reasoning.id)
    const id = shortid.generate()
    const aiReasoning = new AIReasoning({ smart: 100, format: AIReasoningInput.text})
    aiReasoning.on('get-conversation', ()=>{
     
    })
    aiReasoning.on('result',(result)=>{
      cursor.result({ data: result })
    })
    aiReasoning.on('end',()=>{
      cursor.end()
    })
    aiReasoning.run(reasoning.data)
  })

  
}
