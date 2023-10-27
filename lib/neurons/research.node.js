var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import axios from 'axios';
const findFromGoogle = (ai, query) => __awaiter(void 0, void 0, void 0, function* () {
    const variable = query === null || query === void 0 ? void 0 : query.toLowerCase();
    if (query === undefined || query === null || query === '') {
        return [];
    }
    const result = yield axios.get(ai.config.GOOL.concat(`&q=${query}`)).then((r) => __awaiter(void 0, void 0, void 0, function* () { return r.data; })).catch(() => ({ items: [] }));
    return result.items.filter((item) => {
        const title = item.title.toLowerCase();
        const snippet = item.snippet.toLowerCase();
        // console.log('findFromGoogle', title, 'variable=', variable)
        if (title.includes(`definition of ${variable}`)) {
            return true;
        }
        if (title.includes(`${variable} definition`)) {
            return true;
        }
        if (title.includes('nary') && title.includes(`${variable}`)) {
            return true;
        }
        if (title.includes('definition') && title.includes(`${variable}`)) {
            return true;
        }
        if (snippet.includes(`${variable}, is`) && snippet.includes(`${variable} is`)) {
            return true;
        }
        return false;
    });
});
const prepareMostAppropriateResult = (query, result) => __awaiter(void 0, void 0, void 0, function* () {
});
const prepareResult = (cursor, input, query, results) => {
    if (results.length === 0) {
        return results;
    }
    cursor.result({ id: input.id, data: Buffer.from('does it mean') });
    results.forEach((result) => {
        cursor.result({ id: input.id, data: Buffer.from(result.snippet) });
    });
    return results;
};
export const researchNode = (ai) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ai.on('research', (input) => __awaiter(void 0, void 0, void 0, function* () {
        const cursor = ai.cursor('research', input.id);
        const variable = input.data.toString('utf8');
        cursor.result({ id: input.id, data: Buffer.from(`Sorry am not sure i understand what ${variable} means`) });
        const results = yield findFromGoogle(ai, variable)
            .then((result) => prepareResult(cursor, input, variable, result));
        yield prepareMostAppropriateResult(variable, [results]);
        cursor.end();
    }));
};
