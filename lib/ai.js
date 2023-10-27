var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AI_id;
import { storeNode } from './neurons/store.node.js';
import { terminalNode } from './neurons/terminal.node.js';
import { memoryNode } from './neurons/memory.node.js';
import { outputNode } from './neurons/output.node.js';
import { inputNode } from './neurons/input.node.js';
import { textReasoningNode } from './neurons/text-reasoning.node.js';
import { MongoClient } from 'mongodb';
import shortid from 'shortid';
import { researchNode } from './neurons/research.node.js';
import { dictionaryNode } from './neurons/dictionary.node.js';
import { SusXSubscription } from 'susx';
import { bootNode } from './neurons/boot.node.js';
import { welcomeNode } from './neurons/welcome.node.js';
import { voiceNode } from './neurons/voice.node.js';
export class AIError extends Error {
}
const ctx = {
    onceEndListeners: [],
    onEndListeners: [],
    onceResultListeners: [],
    onResultListeners: [],
    onceRequestListeners: [],
    onRequestListeners: []
};
export class AICursor extends String {
    constructor(ai, value) {
        super(value);
        this.ai = ai;
        this._id = shortid.generate();
    }
    get resultId() {
        return this.concat('-').concat(this._id);
    }
    getId() {
        return this._id;
    }
    request(input, t = 'emit') {
        return this.ai[t](this.requestId, input, this.getId());
    }
    result(input, t = 'emit') {
        return this.ai[t](this.resultId, input, this.getId());
    }
    end(input, t = 'emit') {
        return this.ai[t](this.endId, input, this.getId());
    }
    onResult(listener) {
        ctx.onResultListeners.push(listener);
        return this.ai.on(this.resultId, listener);
    }
    onceResult(listener) {
        ctx.onceResultListeners.push(listener);
        return this.ai.on(this.resultId, listener);
    }
    onEnd(listener) {
        ctx.onEndListeners.push(listener);
        return this.ai.on(this.endId, listener);
    }
    onceEnd(listener) {
        ctx.onceEndListeners.push(listener);
        return this.ai.once(this.endId, listener);
    }
    off(event) {
        switch (event) {
            case 'all':
            case 'end':
            case 'onceEnd':
                this._offOnceEnd();
            case 'all':
            case 'end':
            case 'onEnd':
                this._offOnEnd();
            case 'all':
            case 'result':
            case 'onResult':
                this._off(ctx.onResultListeners);
            case 'all':
            case 'result':
            case 'onceResult':
                this._off(ctx.onceResultListeners);
            case 'all':
            case 'request':
            case 'onRequest':
                this._off(ctx.onRequestListeners);
            case 'all':
            case 'request':
            case 'onceRequest':
                this._off(ctx.onceRequestListeners);
        }
    }
    _offOnceEnd() {
        this._off(ctx.onceEndListeners);
    }
    _offOnEnd() {
        this._off(ctx.onEndListeners);
    }
    _off(listeners) {
        let listener = undefined;
        while ((listener = listeners.pop()) !== undefined) {
            this.ai.off(this.requestId, listener);
        }
    }
    _offX(listeners) {
        let listener = undefined;
        while ((listener = listeners.shift()) !== undefined) {
            this.ai.off(this.requestId, listener);
        }
    }
    get requestId() {
        return this.toString();
    }
    get endId() {
        return this.concat('-').concat(this._id).concat('-end');
    }
}
export class AI extends SusXSubscription {
    constructor(config) {
        super();
        this.config = config;
        _AI_id.set(this, 1);
        this.cursorType = ['ticker'];
    }
    id() {
        var _a, _b;
        return (__classPrivateFieldSet(this, _AI_id, (_b = __classPrivateFieldGet(this, _AI_id, "f"), _a = _b++, _b), "f"), _a).toString();
    }
    addNeuron(neuron) {
        neuron(this);
        return this;
    }
    document(name, dbName) {
        return this.store.db(dbName).collection(name);
    }
    documentWithSession(name, dbName) {
        const session = this.store.startSession();
        return [session, this.document(name, dbName)];
    }
    cursor(name, id) {
        const result = new AICursor(this, name);
        if (id !== undefined && id !== null) {
            result._id = id;
        }
        return result;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config.DATABASE_URL === null || this.config.DATABASE_URL === undefined) {
                throw new AIError('unable to create store require a db');
            }
            this.store = yield MongoClient.connect(this.config.DATABASE_URL);
        });
    }
    connect() {
        this.broadcast('boot', Date.now());
    }
}
_AI_id = new WeakMap();
export const createAI = (config) => new AI(config)
    .addNeuron(storeNode)
    .addNeuron(terminalNode)
    .addNeuron(memoryNode)
    .addNeuron(outputNode)
    .addNeuron(inputNode)
    .addNeuron(researchNode)
    .addNeuron(bootNode)
    .addNeuron(welcomeNode)
    .addNeuron(voiceNode)
    .addNeuron(dictionaryNode)
    .addNeuron(textReasoningNode);
