import { type AI } from '../ai.js'
interface Dictionary {
  key: string[]
  patterns: RegExp[]
  example: string[]
}
interface DictionaryInput {
  id: string
  key: string
}
export const dictionaryNode = (ai: AI) => {
  ai.on('dictionary', (dict: DictionaryInput) => {
    const cursor = ai.cursor('dictionary', dict.id)
    const doc = ai.document('Dictionary')
    doc.findOne(
      { key: dict.key }
    ).then((result) => cursor.result(result))
  })
}
