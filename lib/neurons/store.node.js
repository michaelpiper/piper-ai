export const storeNode = (ai) => {
    ai.on('store', (docs) => {
        ai.document('Store').insertMany(docs).then(console.log);
    });
};
