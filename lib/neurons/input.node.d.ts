/// <reference types="node" resolution-mode="require"/>
import { type AI } from '../ai.js';
export interface Input {
    id: string;
    sourceId: string;
    source: string;
    destination: string;
    data: Buffer;
    type: {
        mode: 'visual' | 'verbal';
        plain: 'text' | 'audio' | 'image' | 'video';
    };
}
export declare const inputNode: (ai: AI) => Promise<void>;
//# sourceMappingURL=input.node.d.ts.map