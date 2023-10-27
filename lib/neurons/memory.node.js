var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const transformResult = (result) => {
    var _a, _b;
    if (result === null) {
        return null;
    }
    return {
        _id: result._id.toString(),
        created_at: result.created_at,
        parameters: (_b = (_a = result.parameters) === null || _a === void 0 ? void 0 : _a.map((data) => (Object.assign(Object.assign({}, data), { value: data.value.buffer })))) !== null && _b !== void 0 ? _b : [],
        data: result.data.map((data) => (Object.assign(Object.assign({}, data), { value: data.value.buffer }))),
        trigger: result.trigger
    };
};
export const memoryNode = (ai) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ai.on('memory', (input) => __awaiter(void 0, void 0, void 0, function* () {
        const memory = ai.document('Memory');
        if (input.action === 'read') {
            let currentCount = 0;
            ai.emit(`memory-${input.id}-keep-searching`, () => {
                memory.findOne(input.doc, {
                    sort: [['created_at', -1]],
                    skip: currentCount
                }).then((result) => {
                    currentCount++;
                    ai.emit(`memory-${input.id}`, result);
                });
            });
            memory.findOne(input.doc, {
                sort: [['created_at', -1]]
            })
                .then((result) => transformResult(result))
                .then((result) => {
                currentCount++;
                ai.emit(`memory-${input.id}`, result);
            });
            return;
        }
        const result = yield memory.findOneAndUpdate({
            trigger: input.doc.trigger
        }, {
            $setOnInsert: {
                trigger: input.doc.trigger,
                created_at: new Date()
            },
            $push: {
                data: { $each: input.doc.data }
            }
        }, {
            upsert: true
        }).then((result) => transformResult(result));
        // console.log(result, memory.doc.trigger)
        ai.emit(`memory-${input.id}`, result);
    }));
});
