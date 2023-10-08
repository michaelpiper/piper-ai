import { type ObjectId, type Binary } from 'mongodb'
import { type AI } from '../ai.js'
export interface Memory {
  trigger: string
  parameters: Array<{
    trigger: string
    type: 'text' | 'image' | 'video' | 'audio'
    value: Buffer
  }>
  data: Array<{
    trigger: string
    mode: 'output' | 'input'
    type: 'text' | 'image' | 'video' | 'audio'
    value: Buffer
  }>
  created_at: Date
}
export type MemoryInput = { id: string, action: 'write', doc: Omit<Memory, 'created_at' | 'parameters'> } | { id: string, action: 'read', doc: Partial<Memory> }
export interface MemoryOutput extends Memory {
  _id: string
}
export interface MemoryResult extends Omit<Memory, 'data' | 'parameters'> {
  _id: ObjectId
  data: Array<{
    trigger: string
    mode: 'output' | 'input'
    type: 'text' | 'image' | 'video' | 'audio'
    value: Binary
  }>

  parameters: Array<{
    trigger: string
    type: 'text' | 'image' | 'video' | 'audio'
    value: Binary
  }>
}
const transformResult = (result: MemoryResult | null): | PromiseLike<MemoryOutput | null> | MemoryOutput | null => {
  if (result === null) {
    return null
  }
  return {
    _id: result._id.toString(),
    created_at: result.created_at,
    parameters: result.parameters?.map((data: any) => ({ ...data, value: data.value.buffer as Buffer })) ?? [],
    data: result.data.map((data: any) => ({ ...data, value: data.value.buffer as Buffer })),
    trigger: result.trigger
  }
}
export const memoryNode = async (ai: AI) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ai.on('memory', async (input: MemoryInput) => {
    const memory = ai.document('Memory')
    if (input.action === 'read') {
      let currentCount = 0
      ai.emit(`memory-${input.id}-keep-searching`, () => {
        memory.findOne(input.doc, {
          sort: [['created_at', -1]],
          skip: currentCount
        }).then((result) => {
          currentCount++
          ai.emit(`memory-${input.id}`, result)
        })
      })
      memory.findOne(input.doc, {
        sort: [['created_at', -1]]
      })
        .then((result) => transformResult(result as never))
        .then((result): void => {
          currentCount++
          ai.emit(`memory-${input.id}`, result)
        })
      return
    }

    const result = await memory.findOneAndUpdate(
      {
        trigger: input.doc.trigger
      },
      {
        $setOnInsert: {
          trigger: input.doc.trigger,
          created_at: new Date()
        },
        $push: {
          data: { $each: input.doc.data } as any
        }
      },
      {
        upsert: true
      }
    ).then((result) => transformResult(result as never))
    // console.log(result, memory.doc.trigger)
    ai.emit(`memory-${input.id}`, result)
  })
}
