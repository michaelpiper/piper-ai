import { type AI } from "../ai.js"

export const bootNode = (ai: AI) => {
    ai.on('boot', (timestamp) => {
      ai.tap('welcome', timestamp)
    })
  }