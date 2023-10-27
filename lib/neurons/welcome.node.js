export const welcomeNode = (ai) => {
    ai.on('welcome', (timestamp) => {
        const cursor = ai.cursor('welcome');
        ai.tap('output', { id: cursor.getId(), source: 'welcome', sourceId: 'welcome', data: Buffer.from("welcome piper \nhow you doing today"), type: { mode: 'verbal', plain: 'text' } });
    });
};
