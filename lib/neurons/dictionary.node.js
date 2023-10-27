export const dictionaryNode = (ai) => {
    ai.on('dictionary', (dict) => {
        const cursor = ai.cursor('dictionary', dict.id);
        const doc = ai.document('Dictionary');
        doc.findOne({ key: dict.key }).then((result) => cursor.result(result));
    });
};
