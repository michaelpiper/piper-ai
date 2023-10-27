var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkerQueue } from '../libs/worker.lib.js';
import fs from 'fs';
import sound from 'sound-play';
export const voiceNode = (ai) => {
    const queue = new WorkerQueue({
        concurrency: 1
    });
    queue.run();
    // $ mplayer foo.mp3 
    queue.subscribe((input) => __awaiter(void 0, void 0, void 0, function* () {
        const cursor = ai.cursor('voice', input.id);
        const file = cursor.resultId + '.wav';
        try {
            if (input.data) {
                fs.writeFileSync(file, input.data);
            }
            yield sound.play(file).then(() => ai.delay(100));
        }
        catch (error) {
            console.log("error", error);
        }
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }));
    ai.on('voice', (input) => __awaiter(void 0, void 0, void 0, function* () {
        queue.enqueue(input);
    }));
};
