/// <reference types="node" />
module 'node-gtts'{
    import MultiStream from 'multistream'
    const Text2Speech:(_lang: any, _debug?: any) => {
        tokenize: (text: any) => any[]
        createServer: (port: any) => void
        stream: (text: any) => MultiStream
        save: (filepath: any, text: any, callback:( (error:Error| null| undefined, data:any) => void)) => void
    }
    export = Text2Speech
}