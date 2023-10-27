export const bootNode = (ai) => {
    ai.on('boot', (timestamp) => {
        if (ai.config.GREET_ON_BOOT === 'true') {
            ai.tap('welcome', timestamp);
        }
    });
};
