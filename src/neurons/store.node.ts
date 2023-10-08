import { type AI } from '../ai.js'
export const storeNode = (ai: AI) => {
  ai.on('store', (docs: any[]) => {
    ai.document('Store').insertMany(docs).then(console.log)
  })
}
