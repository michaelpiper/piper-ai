/// <reference types="node" resolution-mode="require"/>
import { type AI } from '../ai.js';
export interface ResearchInput {
    id: string;
    type: 'text';
    data: Buffer;
}
export interface ResearchOutput {
    id: string;
    data: Buffer;
}
export declare const researchNode: (ai: AI) => void;
//# sourceMappingURL=research.node.d.ts.map