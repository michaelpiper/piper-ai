import { type AI } from "../ai.js"

export const bootNode = (ai: AI) => {
    ai.on('boot', (timestamp) => {
      if(ai.config.GREET_ON_BOOT === 'true'){
        ai.tap('welcome', timestamp)
      }
    })
  }