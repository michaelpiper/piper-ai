var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const inputNode = (ai) => __awaiter(void 0, void 0, void 0, function* () {
    ai.on('input', (input) => {
        const reasoning = ai.cursor(input.type.plain + '-reasoning');
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        reasoning.onResult((data) => __awaiter(void 0, void 0, void 0, function* () {
            const memory = ai.cursor('memory');
            const output = ai.cursor('output');
            memory.request({ id: memory.getId(), action: 'write', doc: { trigger: input.sourceId, data: [{ trigger: input.sourceId, mode: 'input', type: input.type.plain, value: input.data }] } });
            yield ai.observe(memory.resultId, (v) => v);
            output.result(Object.assign({ sourceId: input.sourceId, type: input.type, id: input.id, source: input.source, destination: input.destination }, data));
        }));
        reasoning.onceEnd(() => {
            reasoning.off('result');
        });
        reasoning.request({ sourceId: input.sourceId, data: input.data, id: reasoning.getId() });
    });
});
