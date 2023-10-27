/// <reference types="node" resolution-mode="require"/>
import { type AI } from '../ai.js';
export interface Output {
    id: string;
    sourceId: string;
    source: string;
    destination?: string;
    data: Buffer;
    type: {
        mode: 'visual' | 'verbal';
        plain: 'text' | 'audio' | 'image' | 'video';
    };
}
export declare const outputNode: (ai: AI) => Promise<void>;
//# sourceMappingURL=output.node.d.ts.map