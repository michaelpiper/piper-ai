/// <reference types="node" resolution-mode="require"/>
import { type ObjectId, type Binary } from 'mongodb';
import { type AI } from '../ai.js';
export interface Memory {
    trigger: string;
    parameters: Array<{
        trigger: string;
        type: 'text' | 'image' | 'video' | 'audio';
        value: Buffer;
    }>;
    data: Array<{
        trigger: string;
        mode: 'output' | 'input';
        type: 'text' | 'image' | 'video' | 'audio';
        value: Buffer;
    }>;
    created_at: Date;
}
export type MemoryInput = {
    id: string;
    action: 'write';
    doc: Omit<Memory, 'created_at' | 'parameters'>;
} | {
    id: string;
    action: 'read';
    doc: Partial<Memory>;
};
export interface MemoryOutput extends Memory {
    _id: string;
}
export interface MemoryResult extends Omit<Memory, 'data' | 'parameters'> {
    _id: ObjectId;
    data: Array<{
        trigger: string;
        mode: 'output' | 'input';
        type: 'text' | 'image' | 'video' | 'audio';
        value: Binary;
    }>;
    parameters: Array<{
        trigger: string;
        type: 'text' | 'image' | 'video' | 'audio';
        value: Binary;
    }>;
}
export declare const memoryNode: (ai: AI) => Promise<void>;
//# sourceMappingURL=memory.node.d.ts.map