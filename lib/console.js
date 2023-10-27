import { config } from 'dotenv';
import { createAI } from './index.js';
config();
const ai = createAI(process.env);
ai.initialize().then(() => ai.connect());
