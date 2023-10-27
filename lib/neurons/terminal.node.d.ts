/// <reference types="node" resolution-mode="require"/>
import { type AI } from '../ai.js';
export interface TerminalInput {
    id: string;
    data: Buffer;
}
export interface TerminalOutput {
    id: string;
    data: Buffer;
}
export declare const terminalNode: (ai: AI) => Promise<void>;
//# sourceMappingURL=terminal.node.d.ts.map