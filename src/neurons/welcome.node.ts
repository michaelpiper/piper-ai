import { type AI } from "../ai.js";
import { Output } from "./output.node.js";

export const welcomeNode = (ai: AI) => {
   ai.on('welcome', (timestamp: number)=>{
    const cursor = ai.cursor('welcome')
    ai.tap('output', { id: cursor.getId(), source:'welcome',sourceId:'welcome', data: Buffer.from("welcome piper \nhow you doing today"), type: { mode: 'verbal', plain:'text'} } satisfies Output)
   })
}