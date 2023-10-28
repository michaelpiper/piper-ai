import { ClientSession, Collection, MongoClient, Document } from 'mongodb';
import { SusXSubscription } from 'susx';
export declare class AIError extends Error {
}
export declare class AICursor<Request = any, Response = any, End = any> extends String {
    private ai;
    constructor(ai: AI, value: string);
    _id: string;
    get resultId(): string;
    getId(): string;
    request<T = Request>(input: T, t?: 'emit' | 'broadcast' | 'tap'): boolean;
    result<T = Response>(input: T, t?: 'emit' | 'broadcast' | 'tap'): boolean;
    end<T = End>(input?: T, t?: 'emit' | 'broadcast' | 'tap'): boolean;
    onResult(listener: Function): AI;
    onceResult(listener: Function): AI;
    onEnd(listener: Function): AI;
    onceEnd(listener: Function): AI;
    off(event: 'end' | 'onEnd' | 'onceEnd' | 'onResult' | 'onceResult' | 'result' | 'onRequest' | 'onceRequest' | 'request' | 'all'): void;
    _offOnceEnd(): void;
    _offOnEnd(): void;
    _off(listeners: Function[]): void;
    _offX(listeners: Function[]): void;
    get requestId(): string;
    get endId(): string;
}
export declare class AI extends SusXSubscription {
    #private;
    config: Record<string, string | number | undefined>;
    store: MongoClient;
    cursorType: string[];
    constructor(config: Record<string, string | number | undefined>);
    id(): string;
    addNeuron(neuron: (ai: this) => any): this;
    document(name: string, dbName?: string): Collection<Document>;
    documentWithSession(name: string, dbName?: string): [ClientSession, Collection<Document>];
    cursor<Req, Res, End>(name: string, id?: string): AICursor<Req, Res, End>;
    initialize(): Promise<void>;
    connect(): void;
}
export declare const createAI: (config: Record<string, string | undefined>) => AI;
//# sourceMappingURL=ai.d.ts.map