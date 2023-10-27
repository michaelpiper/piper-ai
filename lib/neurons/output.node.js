var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const outputNode = (ai) => __awaiter(void 0, void 0, void 0, function* () {
    ai.on('output', (output) => __awaiter(void 0, void 0, void 0, function* () {
        const cursor = ai.cursor('output');
        ai.emit('memory', { id: ai.id(), action: 'write', doc: { trigger: output.sourceId, data: [{ trigger: output.sourceId, mode: 'output', type: output.type.plain, value: output.data }] } });
        if (ai.has('voice') && output.type.mode === 'verbal') {
            if (output.type.plain === 'audio') {
                ai.emit('voice', output.data);
                return;
            }
            else if (output.type.plain === 'text') {
                const gTTS = yield import('node-gtts');
                const gtts = gTTS.default('en');
                const words = output.data.toString();
                const voice = ai.cursor('voice');
                yield new Promise((resolve, reject) => gtts.save(voice.resultId.concat('.wav'), words, (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(data);
                }));
                ai.tap('voice', { id: voice.getId(), data: null });
                return;
            }
        }
        if ([null, undefined].includes(output.destination) && ai.has('terminal-output')) {
            ai.emit('terminal-output', output);
            return;
        }
        ai.emit(output.destination, output);
    }));
});
