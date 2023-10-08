import { type AI } from '../ai.js'
import { Output } from './output.node.js'
import { WorkerQueue } from '../libs/worker.lib.js'
import fs from 'fs'
import sound from 'sound-play'
export const voiceNode = (ai: AI) => {
  const queue = new WorkerQueue<{id:string, data:Buffer|null}>({
    concurrency: 1
  })
  // $ mplayer foo.mp3 
  queue.subscribe(async (input)=>{
    const cursor = ai.cursor('voice', input.id)
    const file = cursor.resultId+'.wav'
    try {
      if(input.data){
        fs.writeFileSync(file, input.data)
      }
      await sound.play(file).then(()=>ai.delay(100))
    } catch (error) {
      console.log("error", error)
    }
    if(fs.existsSync(file)){
      fs.unlinkSync(file)
    }
  })
  ai.on('voice', async (input: {id:string, data:Buffer|null}) => {
    queue.enqueue(input)
  })
}
